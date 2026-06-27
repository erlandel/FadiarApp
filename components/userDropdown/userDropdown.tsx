"use client";
import { useState, useRef, useEffect } from "react";
import { UserCircle } from "lucide-react";
import Link from "next/link";
import {
  HugeiconsUserAi,
  MdiRegister,
  NextUilExit,
  TablerUserCircle,
  UilExit,
} from "@/icons/icons";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/utils/refreshToken";
import SuccesMessage from "@/messages/succesMessage";
import { logoutUrl } from "@/urlApi/urlApi";
import { onClickOutside } from "@/utils/clickOutside";
import { clearSession } from "@/utils/clearSession";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { auth, setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    setIsOpen(false);

    if (auth?.access_token && auth?.refresh_token) {
      try {
        const currentToken = await refreshToken(auth, setAuth);

        if (currentToken === null) {
          router.push("/");
          return;
        }

        const response = await fetch(`${logoutUrl}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify({ refresh_token: auth.refresh_token }),
        });

        if (!response.ok) {
          console.error("Error al cerrar sesión en el servidor");
        }
      } catch (error) {
        console.error("Error de red al cerrar sesión:", error);
      }
    }

    clearSession();
    SuccesMessage("Sesión cerrada con éxito");
    router.push("/");
  };

  useEffect(() => {
    const cleanup = onClickOutside(dropdownRef, () => setIsOpen(false), {
      enabled: isOpen,
    });
    return cleanup;
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer focus:outline-none"
        aria-label="User menu"
      >
        {auth?.access_token ? (
          <HugeiconsUserAi className="mt-1.5" />
        ) : (
          <TablerUserCircle className="mt-1.5 " />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-58 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 z-50  space-x-2  ">
          {auth?.access_token ? (
            <>
              <Link
                href="/myProfile"
                className="group flex items-center hover:bg-[#F5F7FA] transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                <UserCircle
                  className="text-[#777777] group-hover:text-[#022954] transition-colors"
                  width={22}
                  height={22}
                />
                <span className="text-[#777777] group-hover:text-[#022954]  group-hover:font-bold font-medium text-md ml-2 transition-colors">
                  Perfil
                </span>
              </Link>

              <Link
                href="/orders"
                className="group flex items-center hover:bg-[#F5F7FA] transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                <NextUilExit
                  className="text-[#777777] group-hover:text-[#022954] transition-colors"
                  width={20}
                  height={20}
                />
                <span className="text-[#777777] group-hover:text-[#022954] font-medium group-hover:font-bold ml-2 transition-colors">
                  Mis Pedidos
                </span>
              </Link>

              <button
                className="group flex items-center  hover:bg-[#F5F7FA]  transition-colors w-full p-2 cursor-pointer"
                onClick={handleLogout}
              >
                <UilExit
                  className="text-[#EB0C0C] group-hover:text-[#EB0C0C] transition-colors"
                  width={20}
                  height={20}
                />

                <span className="text-[#EB0C0C] group-hover:font-bold ml-2">
                  Cerrar Sesión
                </span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="group flex items-center hover:bg-[#F5F7FA] transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                <NextUilExit
                  className="text-[#777777] group-hover:text-[#022954] transition-colors"
                  width={20}
                  height={20}
                />
                <span className="text-[#777777] group-hover:text-[#022954] font-medium group-hover:font-bold ml-2 transition-colors">
                  Login
                </span>
              </Link>

              <Link
                href="/register"
                className="group flex items-center hover:bg-[#F5F7FA] transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                <div className="group">
                  <MdiRegister />
                </div>

                <span className="text-[#777777] group-hover:text-[#022954] font-medium group-hover:font-bold ml-2 transition-colors">
                  Registrarse
                </span>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
