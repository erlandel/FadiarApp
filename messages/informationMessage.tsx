import { useState } from "react";
import { useRouter } from "next/navigation";

interface InformationMessageProps {
  onClose?: () => void;
  title?: string;
  variant?: "delivery" | "pickup";
  orderId?: string;
}

const InformationMessage = ({
  onClose,
  title = "¡Gracias por su compra!",
  variant = "delivery",
  orderId = "",
}: InformationMessageProps) => {
  const [showInfo, setShowInfo] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setShowInfo(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div>
      {showInfo && (
        <div className=" bg-blue-50  rounded-xl  py-7 sm:py-10 px-4  md:px-8 flex flex-col gap-4 relative transition-all animate-in fade-in slide-in-from-top-2  ">

          <div className="w-full text-center ">
            <h4 className="text-3xl  md:text-[40px] font-bold text-primary ">
              {title}
            </h4>
            <div className="mx-auto mt-3 h-2 w-25 bg-primary rounded-full" />
          </div>

          <div className="space-y-4  md:space-y-8  md:mt-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/iconsSVG/CheckCircle.svg"
                alt="Confirmación"
                className="w-10 h-10 md:h-12 md:w-12 shrink-0"
              />
              <div className=" text-sm md:text-lg text-primary leading-snug">
                <p>Su pedido ha sido confirmado exitosamente.</p>
                <p>
                  Número pedido: <span className="font-bold">#{orderId}</span>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="/images/iconsSVG/CalendarClock.svg"
                alt="Plazo"
                className="w-10 h-10 md:h-12 md:w-12 shrink-0"
              />
              <p className="text-sm md:text-lg text-primary leading-snug">
                {variant === "delivery"
                  ? "La entrega se realizará en un plazo de 24 a 72 horas."
                  : "Puede recogerlo en nuestra sede en un plazo de 7 días hábiles."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {variant === "delivery" ? (
                <img
                  src="/images/iconsSVG/Smartphone.svg"
                  alt="Contacto"
                  className="w-10 h-13.5 md:h-15 md:w-12 shrink-0"
                />
              ) : (
                <img
                  src="/images/iconsSVG/FileText.svg"
                  alt="Documento"
                  className="w-10 h-10 md:h-12 md:w-12 shrink-0"
                />
              )}
              <p className="text-sm md:text-lg text-primary leading-snug">
                {variant === "delivery"
                  ? "Nuestro equipo logístico se comunicará al número telefónico proporcionado para coordinar los detalles."
                  : "Deberá presentar su número de pedido al momento de la recogida."}
              </p>
            </div>

            {variant === "pickup" && (
              <div className="flex ml-3 ">
                <p className="text-sm md:text-lg text-primary leading-snug">
                  Si necesita más información, nuestro equipo estará disponible
                  para asistirle.
                </p>
              </div>
            )}
          </div>

          <div className="text-center text-primary font-bold uppercase text-md md:text-[22px] mt-2 ">
            Gracias por confiar en Grupo Fadiar.
          </div>

          <div className="flex justify-between space-x-2 sm:space-x-4 mt-4">
            <div className="w-full">
              <button
                 onClick={() => router.push("/")}
               className=" text-primary border border-primary h-14 w-full font-semibold rounded-xl hover:scale-103 transition cursor-pointer flex items-center justify-center ">
                Seguir comprando
              </button>
            </div>
            <div className="w-full">
              <button
                 onClick={handleClose}
                className="bg-[#022954] text-white h-14 w-full font-semibold rounded-xl hover:scale-103 transition cursor-pointer hover:bg-[#034078] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                Mis pedidos
              </button>
            </div>

          


          </div>
        </div>
      )}
    </div>
  );
};

export default InformationMessage;
