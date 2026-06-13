import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../../store/authStore";
import { get_addressesUrl } from "@/urlApi/urlApi";
import { refreshToken } from "@/utils/refreshToken";


export const useGetAddresses = (options?: { enabled?: boolean }) => {
  const { auth, setAuth } = useAuthStore();

  const fetchAddresses = async () => {
    if (!auth) return [];

    const currentAccessToken = await refreshToken(auth, setAuth);

    const response = await fetch(get_addressesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentAccessToken}`,
      },
      body: JSON.stringify({ id_user: auth.user.id }),
    });

    console.log("Response status:", response.status);

    if(response.status === 204) {
      return [];
    }

    if (!response.ok) {
      
      // throw new Error("Error al obtener las direcciones");
    }

    const data = await response.json();
    console.log("Respuesta del backend (obtener direcciones):", data);

    let addresses = [];
    if (data && data.listado && Array.isArray(data.listado)) {
      addresses = data.listado;
    } else if (Array.isArray(data)) {
      addresses = data;
    }

    // Mapeamos los datos para que personalData pueda mostrarlos
    // El backend devuelve 'to_jsonb' con el nombre del municipio
    return addresses.map((addr: any) => {
      const municipioNombre = addr.to_jsonb || addr.municipio;
      return {
        ...addr,
        municipio: municipioNombre,
        municipioId: addr.id_municipio,
        provincia: addr.provincia,
      };
    });
  };

  const {
    data: addresses,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["addresses", auth?.user?.id],
    queryFn: fetchAddresses,
    enabled: (options?.enabled ?? true) && !!auth?.user?.id,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  return {
    addresses: addresses || [],
    isLoading,
    isError,
    refetch,
  };
};
