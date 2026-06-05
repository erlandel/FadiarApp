import { useQuery } from "@tanstack/react-query";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { Product } from "@/types/product";
import { best_selling_productsUrl } from "@/urlApi/urlApi";

export const useBestSelling = (count: number = 15) => {
  const { municipalityId,provinceId } = useProductsByLocationStore();

  return useQuery<Product[]>({
    queryKey: ["best-selling", municipalityId, count],

 
    queryFn: async () => {
      const res = await fetch(`${best_selling_productsUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count,
          municipio: municipalityId,   
          id_provincia:provinceId     
        }),
      });

      console.log("Respuesta del backend (obtener productos más vendidos):", res);
      if (!res.ok) {
        throw new Error("Error al obtener productos más vendidos");
      }

      const data = await res.json();
      const products = Array.isArray(data) ? data : [];
      return products.map((p: any) => ({ ...p, id: String(p.id) }));
    },
    staleTime: Infinity, // Solo cambia si cambia la provincia o se invalida manualmente
    refetchOnWindowFocus: false,   
  });
};
