import { refresh_tokenUrl } from "@/urlApi/urlApi";
import { AuthPayload } from "../store/authStore";
import { clearSession } from "./clearSession";
import ErrorMessage from "@/messages/errorMessage";

let refreshPromise: Promise<string | null> | null = null;

// Función para verificar si el token está expirado
const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    // console.log("Payload exp:", payload.exp);
    // Agregar margen de 30 segundos para evitar edge cases
    return payload.exp * 1000 < Date.now() + 30000;
  } catch {
    return true; // Si no puede decodificar, asumir expirado
  }
};

export const refreshToken = async (
  auth: AuthPayload | null,
  setAuth: (payload: AuthPayload) => void
): Promise<string | null> => {
  if (!auth) return null;

  // Si el token no está expirado, devolver el mismo token
  if (!isTokenExpired(auth.access_token)) {
    console.log("Token no expirado, devolviendo el mismo token");
    return auth.access_token;
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refreshResponse = await fetch(`${refresh_tokenUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: auth.refresh_token,
        }),
      });
   console.log("Rerefresh_token:", refreshResponse);
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        
        if (refreshData.access_token) {
          const newAccessToken = refreshData.access_token;
          const newRefreshToken = refreshData.refresh_token || auth.refresh_token;
          
          setAuth({
            ...auth,
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
          });

          return newAccessToken;
        }
      }
      
      if (refreshResponse.status === 403 || refreshResponse.status === 401) {
        console.error("Refresh token inválido o expirado");
        clearSession();
        ErrorMessage("Tu sesión ha expirado");
        return null;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    } finally {
      refreshPromise = null;
    }
    
    return auth.access_token;
  })();

  return refreshPromise;
};
