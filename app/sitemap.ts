
import { MetadataRoute } from "next";
import { inventory_managerUrl } from "@/urlApi/urlApi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const params = new URLSearchParams();
    params.append("emisor", "web");
    params.append("productos", "true");

    const res = await fetch(`${inventory_managerUrl}?${params.toString()}`);
    const data = await res.json();

    const tiendas = data.tiendas?.filter((t: any) => t.active) || [];
    const allProducts = tiendas.flatMap((t: any) => t.productos || []);

    const productUrls = allProducts.map((p: any) => ({
      url: `https://fadiar.com/product/${p.id}`,
      lastModified: new Date(),
      priority: 0.9,
    }));

    return [
      { url: "https://fadiar.com",         priority: 1.0 },
      { url: "https://fadiar.com/products", priority: 0.9 },
      { url: "https://fadiar.com/about",    priority: 0.8 },
      { url: "https://fadiar.com/contact",  priority: 0.7 },
      { url: "https://fadiar.com/faq",      priority: 0.7 },
      { url: "https://fadiar.com/shipping", priority: 0.6 },
      { url: "https://fadiar.com/warranty", priority: 0.6 },
      ...productUrls,
    ];
  } catch {
    return [
      { url: "https://fadiar.com",         priority: 1.0 },
      { url: "https://fadiar.com/products", priority: 0.9 },
      { url: "https://fadiar.com/about",    priority: 0.8 },
      { url: "https://fadiar.com/contact",  priority: 0.7 },
      { url: "https://fadiar.com/faq",      priority: 0.7 },
      { url: "https://fadiar.com/shipping", priority: 0.6 },
      { url: "https://fadiar.com/warranty", priority: 0.6 },
    ];
  }
}