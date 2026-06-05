import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/authStore";
import { refreshToken } from "@/utils/refreshToken";
import { denegar_pedidoUrl } from "@/urlApi/urlApi";
import ErrorMessage from "@/messages/errorMessage";
import SuccesMessage from "@/messages/succesMessage";

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { auth, setAuth } = useAuthStore.getState();

      if (!auth?.access_token) {
        ErrorMessage("No se pudo obtener una sesión válida");
        throw new Error("No auth token");
      }

      const token = await refreshToken(auth, setAuth);

      if (!token) {
        ErrorMessage("No se pudo obtener una sesión válida");
        throw new Error("No token");
      }

      const response = await fetch(denegar_pedidoUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_order: orderId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData.error || errorData.message ;
        ErrorMessage(msg);
        throw new Error(msg);
      }

      console.log(response);
      return response.json();
    },
    onSuccess: (_, orderId) => {
      queryClient.setQueriesData({ queryKey: ["orders"] }, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          orders: oldData.orders.map((order: any) =>
            order.id === orderId ? { ...order, status: "Cancelado" } : order
          ),
        };
      });
     
      SuccesMessage("Orden cancelada correctamente");
    },
    onError: (error: any) => {
      console.error("Error al cancelar la orden:", error);
    },
  });

  return {
    cancelOrder: cancelOrderMutation.mutate,
    isLoading: cancelOrderMutation.isPending,
    isError: cancelOrderMutation.isError,
    error: cancelOrderMutation.error,
    variables: cancelOrderMutation.variables,
  };
};