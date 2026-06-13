import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import useCartStore, { CartItem } from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import MatterCart1Store from "@/store/matterCart1Store";
import { refreshToken } from "@/utils/refreshToken";
import { get_cart_productsUrl } from "@/urlApi/urlApi";
import WarningMenssage from "@/messages/warningMenssage";
import { clearCartCookie, setCartCookie } from "@/utils/cookies";

export const syncCartStandalone = async (options: { setDeliveryDefault?: boolean } = {}): Promise<boolean> => {
  const { setDeliveryDefault = true } = options;
  const { auth, setAuth } = useAuthStore.getState();

  if (!auth?.access_token || !auth?.user?.id) {
    console.log("[syncCartStandalone] No hay auth, abortando");
    return false;
  }

  try {
    const token = await refreshToken(auth, setAuth);
    if (!token) {
      console.log("[syncCartStandalone] No se pudo obtener token");
      return false;
    }

    const response = await fetch(`${get_cart_productsUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_user: auth.user.id,
        comisiones: true,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("[syncCartStandalone] Carrito obtenido:", data);

      const mappedItems: CartItem[] = [];
      const rawCarrito = data.carrito || [];
      const expiran: boolean = data.expiran;

      useCartStore.getState().setRawCart(rawCarrito);

      if (rawCarrito.length > 0 && setDeliveryDefault) {
        MatterCart1Store.getState().updateFormData({ delivery: false });
      }

      rawCarrito.forEach((tienda: any) => {
        const tiendaId = tienda.id;
        const tiendaName = tienda.name;
        const tiendaDireccion = tienda.direccion;
        const productos = tienda.productos || [];

        productos.forEach((item: any) => {
          const p = item.producto;
          if (p && item.aliveUntil > 0) {
            mappedItems.push({
              cartId: item.id,
              productId: String(p.id),
              title: p.name,
              brand: p.brand,
              category: p.categoria?.name,
              warranty: p.warranty ? String(p.warranty) : undefined,
              price:
                p.temporal_price && Number(p.temporal_price) !== 0
                  ? String(p.temporal_price)
                  : String(p.price),
              temporal_price: p.temporal_price
                ? String(p.temporal_price)
                : undefined,
              image: p.img,
              quantity: item.en_carrito,
              expiryTimestamp:
                expiran && item.aliveUntil
                  ? Date.now() + Number(item.aliveUntil) * 1000
                  : undefined,
              currency: p.currency,
              tiendaId: tiendaId,
              tiendaName: tiendaName,
              tiendaDireccion: tiendaDireccion,
            });
          }
        });
      });

      useCartStore.getState().setItems(mappedItems);

      // NUEVO: Setear cookie persistente si hay items
      if (mappedItems.length > 0) {
        setCartCookie();
      } else {
        clearCartCookie();
      }

      // Sincronizar stores de cart3
      const currentStores = MatterCart1Store.getState().formData.stores;
      if (currentStores && currentStores.length > 0) {
        const updatedStores = currentStores
          .map((store) => ({
            ...store,
            products: store.products
              .filter((p: any) =>
                mappedItems.some(
                  (item) => String(item.productId) === String(p.productId),
                ),
              )
              .map((p: any) => {
                const updated = mappedItems.find(
                  (item) => String(item.productId) === String(p.productId),
                );
                return updated
                  ? { ...p, expiryTimestamp: updated.expiryTimestamp }
                  : p;
              }),
          }))
          .filter((store) => store.products.length > 0);

        MatterCart1Store.getState().updateFormData({ stores: updatedStores });
      }

      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error(
        "[syncCartStandalone] Error al obtener carrito:",
        errorData,
      );
      return false;
    }
  } catch (error) {
    console.error("[syncCartStandalone] Error de conexión:", error);
    return false;
  }
};

export const useSyncCart = (autoSync: boolean = false) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scheduledExpiryRef = useRef<number | null>(null);

  const syncCart = useCallback(async (options?: { setDeliveryDefault?: boolean }) => {
    const { auth } = useAuthStore.getState();
    if (!auth?.access_token || !auth?.user?.id) return;

    setLoading(true);
    try {
      await syncCartStandalone(options);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!autoSync || items.length === 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      scheduledExpiryRef.current = null;
      return;
    }

    const now = Date.now();
    let minExpiry = Infinity;

    items.forEach((item) => {
      if (item.expiryTimestamp && item.expiryTimestamp > now) {
        if (item.expiryTimestamp < minExpiry) {
          minExpiry = item.expiryTimestamp;
        }
      }
    });

    if (minExpiry === Infinity) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      scheduledExpiryRef.current = null;
      return;
    }

    if (minExpiry !== Infinity && minExpiry !== scheduledExpiryRef.current) {
      if (timerRef.current) clearTimeout(timerRef.current);

      scheduledExpiryRef.current = minExpiry;
      const delay = minExpiry - now;

      timerRef.current = setTimeout(async () => {
        const expiredItem = items.find(
          (item) => item.expiryTimestamp && item.expiryTimestamp <= Date.now(),
        );

        scheduledExpiryRef.current = null;

        // Primero sincronizamos el carrito (remueve items expirados del store)
        await syncCart({ setDeliveryDefault: true });

        // Luego mostramos warning y redirigimos
        if (expiredItem) {
          WarningMenssage(
            `El producto "${expiredItem.title}" ha expirado y fue removido del carrito`,
          );
          const cartPaths = ["/cart1", "/cart2", "/cart3"];
          const shouldRedirect = cartPaths.some((path) =>
            pathname?.includes(path),
          );
          if (shouldRedirect && useCartStore.getState().items.length === 0) {
            router.push("/");
          }
        }
      }, delay + 2000);
    }

    return () => {
      // No limpiamos el timer aquí para permitir que persista entre renders
      // si el carrito no ha cambiado
    };
  }, [items, syncCart, autoSync]);

  return { syncCart, loading };
};
