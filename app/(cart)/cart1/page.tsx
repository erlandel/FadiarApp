"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Amount from "@/components/amount/amount";
import CartCard from "@/components/cartCard/cartCard";
import { CheckoutStepper } from "@/components/ui/stepper";
import { SectionMobile } from "@/sections/sectionMobile";
import { BannerMobilePay } from "@/components/banner/bannerMobilePay";
import { BestSelling } from "@/sections/sectionsProducts/bestSelling";
import useCartStore from "@/store/cartStore";
import StoreSelector from "@/components/storeSelector/storeSelector";
import ListByStore from "@/components/listByStore/listByStore";
import { useSyncCart } from "@/hooks/cartRequests/useSyncCart";

export default function Cart1() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const [isClient, setIsClient] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | number>(
    "all",
  );
  const { syncCart } = useSyncCart();

  useEffect(() => {
    setIsClient(true);
      syncCart({ setDeliveryDefault: false });
  }, []);

  // Items del carrito (sin filtrar por domicilio)
  const filteredByDeliveryItems = items;

  // Extraer tiendas únicas del carrito filtrado
  const stores = filteredByDeliveryItems.reduce(
    (acc, item) => {
      const tiendaId = item.tiendaId || "unknown";
      if (!acc.find((s) => s.id === tiendaId)) {
        acc.push({
          id: tiendaId,
          name: item.tiendaName || "Tienda",
        });
      }
      return acc;
    },
    [] as { id: string | number; name: string }[],
  );

  // Resetear la tienda seleccionada si ya no está disponible
  useEffect(() => {
    if (
      selectedStoreId !== "all" &&
      !stores.find((s) => s.id === selectedStoreId)
    ) {
      setSelectedStoreId("all");
    }
  }, [stores, selectedStoreId]);

  // Añadir la opción "Todas"
  const allStores = [{ id: "all", name: "Todas" }, ...stores];

  // Agrupar items por tienda (filtrando por la tienda seleccionada)
  const groupedItems = filteredByDeliveryItems.reduce(
    (acc, item) => {
      const tiendaId = item.tiendaId || "unknown";

      // Si hay una tienda seleccionada y no es "all", filtramos
      if (selectedStoreId !== "all" && tiendaId !== selectedStoreId) {
        return acc;
      }

      if (!acc[tiendaId]) {
        acc[tiendaId] = {
          name: item.tiendaName || "Tienda",
          direccion: item.tiendaDireccion || "",
          items: [],
        };
      }
      acc[tiendaId].items.push(item);
      return acc;
    },
    {} as Record<
      string | number,
      { name: string; direccion: string; items: typeof items }
    >,
  );

  return (
    <div>
      <div className="sm:px-6 xl:px-6 2xl:px-25">
        <div className="mx-4">
          <div className="mt-10">
            <p className="text-xs text-gray-400 mb-4">
              <Link href="/" className="text-gray-400 cursor-pointer">
                Inicio -{" "}
              </Link>
              <span className="text-primary font-semibold">
                Carrito de Compras
              </span>
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-3xl text-primary font-bold">Carrito</h1>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="w-160 ml-2 lg:ml-20">
              <CheckoutStepper currentStep={0} />
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center  justify-center  xl:flex-row xl:items-start  ">
            <div className="w-full sm:w-auto">
              {isClient && items.length > 0 && (
                <StoreSelector
                  stores={allStores}
                  selectedId={selectedStoreId}
                  onChange={setSelectedStoreId}
                  label="Tienda(s)"
                />
              )}

              {/* LISTA DEL CARRITO */}
              <div className="w-full  mt-5 flex flex-col  gap-y-8 lg:w-140">
                <div className="max-w-120 w-full xl:w-auto 2xl:w-full">
                  {isClient &&
                    (items.length === 0 ? (
                      <div className="flex flex-col gap-y-4 items-center justify-center">
                        <img
                          src="/images/cart1.webp"
                          alt="no se encontraron productos"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <ListByStore
                        groups={Object.values(groupedItems)}
                        renderItem={(item: any) => (
                          <CartCard
                            key={item.productId}
                            brand={item.brand}
                            price={item.price}
                            temporal_price={item.temporal_price}
                            image={item.image}
                            title={item.title}
                            quantityProducts={item.quantity}
                            currency={item.currency}
                            width="w-full"
                            padding="p-3 sm:p-4"
                            actionIcon="delete"
                            productId={item.productId}
                            cartId={item.cartId}
                            tiendaId={item.tiendaId}
                            onDelete={removeItem}
                            expiryTimestamp={item.expiryTimestamp}
                          />
                        )}
                      />
                    ))}
                </div>
              </div>
            </div>

            <div className="w-full max-w-200">
              <Amount />
            </div>
          </div>
        </div>

        <div className="sm:py-20">
          <SectionMobile />
        </div>
      </div>

      <div className="sm:hidden mt-60">
        <BannerMobilePay />
      </div>

      <div className="xl:hidden">
        <BestSelling />
      </div>
    </div>
  );
}
