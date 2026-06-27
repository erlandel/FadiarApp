"use client";

import BannerUpcomingProducts from "@/components/banner/bannerUpcomingProducts";
import NineOffers from "@/sections/sectionsProducts/NineOffers";
import { LatestProducts } from "@/sections/sectionsProducts/latestProducts";
import { BestSelling } from "@/sections/sectionsProducts/bestSelling";
import { useInventory } from "@/hooks/productRequests/useInventory";
import { NoProductsFound } from "@/components/NoProductsFound/noProductsFound";

export default function HomeClient() {
  const { data: inventoryData, isLoading: inventoryLoading } = useInventory();

  const showGlobalNoProducts = 
    !inventoryLoading && (!inventoryData?.products || inventoryData.products.length === 0);

  return showGlobalNoProducts ? (
    <div className="mt-25 sm:mt-30 flex justify-center">
      <NoProductsFound />
    </div>
  ) : (
    <>
      <LatestProducts />
      <NineOffers />
      <BannerUpcomingProducts />
      <BestSelling />
    </>
  );
}
