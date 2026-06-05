"use client";
import CardSkeleton from "@/components/ui/skeletonCard";
import { Product } from "@/types/product";
import { useBestSelling } from "@/hooks/productRequests/useBestSelling";
import { useInventory } from "@/hooks/productRequests/useInventory";
import { useMemo } from "react";
import CardProduct from "@/components/ui/cardProduct";
import CardCarousel from "@/components/ui/cardCarousel";
import { NoProductsFound } from "@/components/NoProductsFound/noProductsFound";

type BestSellingProps = {
  products?: Product[];
};

export const BestSelling = ({ products: productsProp }: BestSellingProps) => {
  // Usar el hook de caché
  const { data: bestSellingProducts = [], isLoading: isBestSellingLoading } = useBestSelling(15);
  // Obtener el inventario de la cache
  const { data: inventoryData, isLoading: isInventoryLoading } = useInventory();

  // Usar productos del estado de caché si no vienen como prop
  const productsToUse: Product[] = Array.isArray(productsProp)
    ? productsProp
    : bestSellingProducts;

  const filteredAndSortedProducts = useMemo(() => {
    // Si no hay inventario cargado, retornamos vacío para evitar mostrar nada mientras carga
    if (!inventoryData?.products) return [];

    // Enriquecer productos con los datos del inventario si existen, o marcarlos como agotados
    const enrichedProducts = productsToUse.map((bestSellingProduct) => {
      // Buscar el producto en el inventario por su ID
      const inventoryProduct = inventoryData.products.find(
        (invProduct) => String(invProduct.id) === String(bestSellingProduct.id)
      );

      if (inventoryProduct) {
        // Si está en el inventario, usamos esos datos (precio, stock real, etc.)
        return inventoryProduct;
      } else {
        // Si no está en el inventario de la provincia, lo marcamos como agotado (count: 0)
        return {
          ...bestSellingProduct,
          count: 0,
        };
      }
    });

    return [...enrichedProducts].sort((a, b) => b.id.localeCompare(a.id));
  }, [productsToUse, inventoryData]);

  const isLoading = isBestSellingLoading || isInventoryLoading;

  return (
    <>
      <div
        id="best-selling"
        className="w-auto h-auto  mt-20 xl:mt-30  "
      >
        <div className="flex flex-col items-start mb-5  mx-4 xl:mx-10 2xl:mx-20">
          <h2 className="text-[24px] font-bold text-[#022954]">
            Tendencias para el hogar
          </h2>
          {/* <h1 className="text-[24px] font-bold text-accent mb-2">
            Lo más Vendido
          </h1> */}
        </div>

        <div className="w-full">
          {isLoading ? (
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="shrink-0">
                  <CardSkeleton position={"vertical"} />
                </div>
              ))}
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <CardCarousel
             direction="right"
              items={filteredAndSortedProducts}
              renderItem={(product) => (
                <CardProduct
                  category={product.categoria?.name}
                  title={product.name}
                  brand={product.brand}
                  warranty={product.warranty}
                  price={product.price}
                  image={product.img}
                  temporal_price={product.temporal_price}
                  currency={product.currency}
                  position="vertical"
                  productId={product.id}                  
                  tiendaId={product.tiendaId || product.id_tienda}
                  count={product.count}
                  fromBestSelling={true}
                />
              )}
              gap={1}
            />
          ) : (
            <NoProductsFound />
          )}
        </div>

        
      </div>
    </>
  );
};
