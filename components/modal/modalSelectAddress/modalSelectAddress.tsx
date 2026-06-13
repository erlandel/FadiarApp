import { X, Loader } from "lucide-react";
import { useMemo, useState } from "react";
import { MunicipalityData } from "@/types/location";
import useLocation from "@/hooks/locationRequests/useLocation";

type AddressItem = {
  id: string;
  provincia: string;
  municipio: string;
  municipioId: string;
  direccion: string;
};

type ModalSelectAddressProps = {
  show: boolean;
  onClose: () => void;
  province: string;
  allowedMunicipalities: MunicipalityData[];
  addresses: AddressItem[];
  isLoading: boolean;
  isError: boolean;
  onSelect: (addr: AddressItem, provinceId: string | null) => void;
};

export default function ModalSelectAddress({
  show,
  onClose,
  province,
  allowedMunicipalities,
  addresses,
  isLoading,
  isError,
  onSelect,
}: ModalSelectAddressProps) {
  const { data } = useLocation();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const provinceId = useMemo(() => {
    const p = data.find((d) => d.provincia === province);
    return p?.id ?? null;
  }, [data, province]);

  const allowedIds = useMemo(
    () => allowedMunicipalities.map((m) => String(m.id)),
    [allowedMunicipalities]
  );

  const filtered = useMemo(() => {
    return addresses
      .filter((addr) => addr.provincia === province)
      .filter(
        (addr) =>
          allowedIds.includes(String(addr.municipioId)) ||
          allowedMunicipalities.some((m) => m.municipio === addr.municipio)
      )
      .map((addr) => ({
        id: String(addr.id),
        provincia: addr.provincia,
        municipio: addr.municipio,
        municipioId: String(addr.municipioId),
        direccion: addr.direccion,
      }));
  }, [addresses, province, allowedIds, allowedMunicipalities]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative shadow-lg mx-2">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 cursor-pointer"
        >
          <X className="w-6 h-6" strokeWidth={2} />
        </button>

        <h5 className="text-primary font-bold text-2xl">Seleccionar Dirección</h5>

        <div className="w-full   sm:px-4 py-3  text-gray-700 mt-4 min-h-[120px] max-h-[480px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <Loader className="animate-spin text-accent" />
            </div>
          ) : isError ? (
            <div className="text-gray-500 font-bold text-center py-4 ">
              No hay direcciones disponibles
            </div>
          ) : filtered && filtered.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filtered.map((addr) => {
                const isSelected = selectedId === addr.id;
                return (
                  <label
                    key={addr.id}
                    className={`flex items-center justify-between gap-4 cursor-pointer p-4 border rounded-2xl transition-all focus-within:ring-0 focus-within:outline-none ${
                      isSelected ? "border-gray-300" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[#022954]   font-bold">
                          Provincia: <span className="font-normal text-gray-700">{addr.provincia}</span>
                        </span>
                        <span className="text-primary font-bold">
                          Municipio: <span className="text-gray-700 font-normal">{addr.municipio}</span>
                        </span>
                          <span className="text-primary font-bold">
                          Dirección: <span className="text-gray-800 font-normal">{addr.direccion}</span>
                        </span>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="addressSelect"
                        value={addr.id}
                        checked={isSelected}
                        onChange={() => {
                          setSelectedId(addr.id);
                          onSelect(addr, provinceId);
                        }}
                        className="peer absolute opacity-0 w-6 h-6 cursor-pointer"
                      />
                      <span className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:border-[#022954] peer-checked:after:w-3 peer-checked:after:h-3 peer-checked:after:rounded-full peer-checked:after:bg-[#022954] peer-checked:after:block after:hidden transition-all" />
                    </div>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4 italic text-sm">
              No hay direcciones registradas
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
