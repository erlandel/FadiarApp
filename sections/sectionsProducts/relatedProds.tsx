import CardProduct from "@/components/ui/cardProduct";
import CardSkeleton from "@/components/ui/skeletonCard";
import { Product } from "@/types/product";
import { useMemo } from "react";

type RelatedProdsProps = {
  products?: Product[];
};

export default function RelatedProds({ products = [] }: RelatedProdsProps) {
  const visibleProducts = useMemo(() => products.slice(0, 6), [products]);

  return (
    <section className="w-full py-10 px-5 xl:px-10 2xl:px-20">
      <div className="flex flex-col gap-1 mb-8">
        <p className="text-[20px] font-bold text-primary">También le puede interesar</p>
        <h2 className="text-[24px] font-bold text-accent">Productos relacionados</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3  place-items-center">
        {visibleProducts.length > 0 ? (
          visibleProducts.map((product) => (
            <CardProduct
              key={product.id}
              productId={product.id}
              category={product.categoria?.name}
              title={product.name}
              brand={product.brand}
              warranty={product.warranty}
              price={product.price}
              image={product.img}
              temporal_price={product?.temporal_price}
              currency={product.currency}
              tiendaId={product.tiendaId}
              count={product.count}
              position="horizontal"
            />
          ))
        ) : (
          Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} position="horizontal" />
          ))
        )}
      </div>
    </section>
  );
}
