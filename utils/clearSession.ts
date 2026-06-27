import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { clearAuthCookie, clearCartCookie } from "@/utils/cookies";

export const clearSession = () => {
  useAuthStore.getState().clearAuth();
  useAuthStore.getState().resetShouldClearCartAfterOrder();
  useCartStore.getState().clearCart();
  clearAuthCookie();
  clearCartCookie();
  localStorage.removeItem("auth-storage");
};
