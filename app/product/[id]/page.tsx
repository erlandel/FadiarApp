import { Metadata } from "next";
import { cache } from "react";
import {
  server_url,
  getProductForVisualUrl,
  upcomingProductsUrl,
} from "@/urlApi/urlApi";
import { ProductID } from "@/types/productId";
import ProductClient from "./ProductClient";
import { getProductSeoMetaData } from "@/data/seoMetaData";

interface PageProps {
  params: Promise<{ id: string }>;
}

// ─── Fetching ────────────────────────────────────────────────────────────────

async function fetchProductById(id: string): Promise<ProductID | null> {
  try {
    const res = await fetch(getProductForVisualUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_product: id }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    const product = data.product;
    if (!product) return null;

    return {
      ...product,
      id: String(product.id),
      img: product.image || product.img,
      currency: data.currencys?.[0] || { currency: "USD" },
    } as ProductID;
  } catch {
    return null;
  }
}

async function fetchProductFromUpcoming(id: string): Promise<ProductID | null> {
  try {
    const res = await fetch(upcomingProductsUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const products = await res.json();
    return products.find((p: ProductID) => String(p.id) === String(id)) || null;
  } catch {
    return null;
  }
}

const fetchProduct = cache(async (id: string): Promise<ProductID | null> => {
  return (await fetchProductById(id)) ?? (await fetchProductFromUpcoming(id));
});

// ─── Schema (construido UNA sola vez) ────────────────────────────────────────

function buildProductSchema(product: ProductID, id: string) {
  const price = product.temporal_price || product.price;
  const currency = product.currency?.currency || "USD";
  const imageUrl = `${server_url}/${product.img}`;
  const productUrl = `https://fadiar.com/product/${id}`;
  const availability =
    product.count && product.count > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ||
      `Producto ${product.name} de la marca ${product.brand}`,
    image: imageUrl,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.categoria?.name,
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: price,
      priceCurrency: currency,
      availability: availability,
      seller: {
        "@type": "Organization",
        name: "Fadiar",
        url: "https://fadiar.com",
      },
    },
    ...(product.warranty && {
      warranty: {
        "@type": "WarrantyPromise",
        durationOfWarranty: {
          "@type": "QuantitativeValue",
          value: Number(product.warranty) / 30,
          unitText: "MES",
        },
      },
    }),
    ...(product.specs &&
      product.specs.length > 0 && {
        additionalProperty: product.specs.map((spec) => ({
          "@type": "PropertyValue",
          name: spec.name,
          value: spec.description,
        })),
      }),
  };
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return {
      title: "Producto | Grupo Fadiar",
      description: "Producto pertenece a la tienda Fadiar",
    };
  }
  const imageUrl = `${server_url}/${product.img}`;

  return getProductSeoMetaData({
    id,
    name: `${product.name} | ${product.brand}`,
    description:
      product.description || `Compra ${product.name} de ${product.brand} en Fadiar.`,
    imageUrl,
  });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await fetchProduct(id);
  const schema = product ? buildProductSchema(product, id) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <ProductClient id={id} />
    </>
  );
}
