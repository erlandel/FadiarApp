"use client";

import BannerUpcomingProducts from "@/components/banner/bannerUpcomingProducts";
import NineOffers from "@/sections/sectionsProducts/NineOffers";
import { LatestProducts } from "@/sections/sectionsProducts/latestProducts";
import { BestSelling } from "@/sections/sectionsProducts/bestSelling";

import { useLatestProducts } from "@/hooks/productRequests/useLatestProducts";
import { useNineOffers } from "@/hooks/productRequests/useNineOffers";
import { useBestSelling } from "@/hooks/productRequests/useBestSelling";
import { useInventory } from "@/hooks/productRequests/useInventory";
import { useMemo } from "react";
import { NoProductsFound } from "@/components/NoProductsFound/noProductsFound";

type InventoryProduct = {
  id: string;
  count?: number;
};

export default function HomeClient() {
  const { data: latest = [], isLoading: latestLoading } = useLatestProducts(10);
  const { data: offers = [], isLoading: offersLoading } = useNineOffers(9);
  const { data: best = [], isLoading: bestLoading } = useBestSelling(10);
  const { data: inventoryData, isLoading: inventoryLoading } = useInventory();

  const bestAfterInventory = useMemo(() => {
    const inventoryProducts: InventoryProduct[] = Array.isArray(inventoryData?.products)
      ? inventoryData.products
      : [];

    if (inventoryProducts.length === 0) return [];

    return best.map((p: InventoryProduct) => {
      const inv = inventoryProducts.find((i) => String(i.id) === String(p.id));
      return inv ?? { ...p, count: 0 };
    });
  }, [best, inventoryData]);

  const isLoadingGlobal =
    latestLoading || offersLoading || bestLoading || inventoryLoading;

  const bestReady = !bestLoading && !inventoryLoading;
  const latestReady = !latestLoading;
  const offersReady = !offersLoading;

  const hasLatest = latest.length > 0;
  const hasOffers = offers.length > 0;
  const hasBest = bestAfterInventory.length > 0;

  const hasAnyProducts = hasLatest || hasOffers || hasBest;

  const showGlobalNoProducts = !isLoadingGlobal && !hasAnyProducts;

  const anySectionMissingProducts =
    (latestReady && !hasLatest) ||
    (offersReady && !hasOffers) ||
    (bestReady && !hasBest);

  return (
    <>
      {showGlobalNoProducts ? (
        <div className="mt-25 sm:mt-30 flex justify-center">
          <NoProductsFound />
        </div>
      ) : (
        <>
          {latestLoading || hasLatest ? (
            <div className="mt-25 sm:mt-0">
              <LatestProducts />
            </div>
          ) : null}

          {offersLoading || hasOffers ? (
            <div>
              <NineOffers />
            </div>
          ) : null}

          <div>
            <BannerUpcomingProducts />
          </div>

          {bestLoading || inventoryLoading || hasBest ? (
            <div>
              <BestSelling />
            </div>
          ) : null}

          {!isLoadingGlobal && anySectionMissingProducts ? (
            <div className="mt-10 flex justify-center">
              <NoProductsFound />
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
