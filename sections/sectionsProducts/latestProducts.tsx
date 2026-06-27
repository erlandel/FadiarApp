"use client";
import CardSkeleton from "@/components/ui/skeletonCard";
import { Product } from "@/types/product";
import { useLatestProducts } from "@/hooks/productRequests/useLatestProducts";
import { useMemo } from "react";
import CardProduct from "@/components/ui/cardProduct";
import CardCarousel from "@/components/ui/cardCarousel";
import { NoProductsFound } from "@/components/NoProductsFound/noProductsFound";

type SectionMasRecientesProps = {
  products?: Product[];
};

export const LatestProducts = ({
  products: productsProp,
}: SectionMasRecientesProps) => {
  // Usar el hook de caché
  const {
    data: latestProductsData = [],
    isLoading,
    isFetching,
  } = useLatestProducts(15);

  // Usar productos del estado de caché si no vienen como prop
  const productsToUse =
    productsProp && productsProp.length > 0 ? productsProp : latestProductsData;

  const lastSixProducts = useMemo(() => [...productsToUse], [productsToUse]);
  const loading =
    !(productsProp && productsProp.length > 0) && (isLoading || isFetching);

  return (
    <>
      <div
        id="latest-products"
        className="w-auto h-auto  mt-20 xl:mt-30  "
      >
        <div className="flex flex-col items-start mb-5 mx-4 xl:mx-10 2xl:mx-20">
          <h2 className="text-[20px] font-bold text-[#022954]">
            Más recientes
          </h2>
          <h2 className="text-[24px] font-bold text-accent mb-2">
            Últimos productos
          </h2>
        </div>

        <div className="w-full">
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 30 }).map((_, index) => (
                <div key={index} className="shrink-0">
                  <CardSkeleton position={"vertical"} />
                </div>
              ))}
            </div>
          ) : lastSixProducts.length > 0 ? (
            <CardCarousel
             direction="right"
              items={lastSixProducts}
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
