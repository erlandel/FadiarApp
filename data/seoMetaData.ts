
import type { Metadata } from "next";

const SITE_NAME = "Fadiar";
export const SITE_URL = "https://fadiar.com";

const defaultOpenGraphImage = {
  url: `${SITE_URL}/images/socialPreview.png`,
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

export const seoMetaData: Record<string, Metadata> = {
  "/": {
    title: "Compra Electrodomésticos Muebles e Iluminación | Tienda Fadiar",
    description:
      "Descubre productos de calidad para tu hogar en la tienda oficial de Fadiar. Electrodomésticos, mobiliario e iluminación con envíos a toda Cuba. Compra online fácil y seguro.",
    alternates: {
      canonical: `${SITE_URL}/`,
    },
    openGraph: {
      title: "Compra Electrodomésticos Muebles e Iluminación | Tienda Fadiar",
      description:
        "Compra online electrodomésticos, muebles e iluminación en Fadiar. Envíos a toda Cuba.",
      url: `${SITE_URL}/`,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Compra Electrodomésticos Muebles e Iluminación | Tienda Fadiar",
      description:
        "Compra online electrodomésticos, muebles e iluminación en Fadiar. Envíos a toda Cuba.",
      images: [defaultOpenGraphImage.url],
    },
  },

  "/products": {
    title: "Productos | Tienda Fadiar",
    description:
      "Explora el catálogo completo de Fadiar: electrodomésticos, muebles e iluminación. Filtra por categorías y encuentra lo que necesitas.",
    alternates: {
      canonical: `${SITE_URL}/products`,
    },
    openGraph: {
      title: "Productos | Tienda Fadiar",
      description:
        "Explora el catálogo completo de Fadiar: electrodomésticos, muebles e iluminación.",
      url: `${SITE_URL}/products`,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Productos | Tienda Fadiar",
      description:
        "Explora el catálogo completo de Fadiar: electrodomésticos, muebles e iluminación.",
      images: [defaultOpenGraphImage.url],
    },
  },

  "/about": {
    title: "Sobre Nosotros | Fadiar",
    description:
      "Conoce a Fadiar: nuestra misión, valores y compromiso con la calidad y el servicio. Soluciones para el hogar con envíos a Cuba.",
    alternates: {
      canonical: `${SITE_URL}/about`,
    },
    openGraph: {
      title: "Sobre Nosotros | Fadiar",
      description:
        "Conoce a Fadiar: misión, valores y compromiso con la calidad y el servicio.",
      url: `${SITE_URL}/about`,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sobre Nosotros | Fadiar",
      description:
        "Conoce a Fadiar: misión, valores y compromiso con la calidad y el servicio.",
      images: [defaultOpenGraphImage.url],
    },
  },

  "/contact": {
    title: "Contacto | Fadiar",
    description:
      "Ponte en contacto con Fadiar para soporte, consultas y seguimiento. Estamos para ayudarte.",
    alternates: {
      canonical: `${SITE_URL}/contact`,
    },
    openGraph: {
      title: "Contacto | Fadiar",
      description: "Soporte, consultas y seguimiento con el equipo de Fadiar.",
      url: `${SITE_URL}/contact`,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Contacto | Fadiar",
      description: "Soporte, consultas y seguimiento con el equipo de Fadiar.",
      images: [defaultOpenGraphImage.url],
    },
  },

  "/faq": {
    title: "Preguntas Frecuentes | Fadiar",
    description:
      "Resuelve tus dudas sobre compras, pagos, envíos y garantías en la tienda de Fadiar.",
    alternates: {
      canonical: `${SITE_URL}/faq`,
    },
    openGraph: {
      title: "Preguntas Frecuentes | Fadiar",
      description: "Dudas sobre compras, pagos, envíos y garantías en Fadiar.",
      url: `${SITE_URL}/faq`,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Preguntas Frecuentes | Fadiar",
      description: "Dudas sobre compras, pagos, envíos y garantías en Fadiar.",
      images: [defaultOpenGraphImage.url],
    },
  },

  "/shipping": {
    title: "Envíos | Fadiar",
    description:
      "Información sobre envíos, cobertura y tiempos de entrega de Fadiar. Recibe tus compras de forma segura.",
    alternates: {
      canonical: `${SITE_URL}/shipping`,
    },
    openGraph: {
      title: "Envíos | Fadiar",
      description: "Cobertura, tiempos de entrega y detalles de envío en Fadiar.",
      url: `${SITE_URL}/shipping`,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Envíos | Fadiar",
      description: "Cobertura, tiempos de entrega y detalles de envío en Fadiar.",
      images: [defaultOpenGraphImage.url],
    },
  },

  "/warranty": {
    title: "Garantía | Fadiar",
    description:
      "Consulta la política de garantía de Fadiar y los pasos para solicitar soporte si tu producto lo requiere.",
    alternates: {
      canonical: `${SITE_URL}/warranty`,
    },
    openGraph: {
      title: "Garantía | Fadiar",
      description: "Política de garantía y soporte postventa en Fadiar.",
      url: `${SITE_URL}/warranty`,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Garantía | Fadiar",
      description: "Política de garantía y soporte postventa en Fadiar.",
      images: [defaultOpenGraphImage.url],
    },
  },
};

export const getProductSeoMetaData = (params?: {
  id?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
}): Metadata => {
  const name = params?.name ?? "Producto";
  const description =
    params?.description ??
    "Descubre detalles, precio y disponibilidad del producto en la tienda de Fadiar.";
  const url = params?.id ? `${SITE_URL}/product/${params.id}` : `${SITE_URL}/product`;
  const imageUrl = params?.imageUrl ?? defaultOpenGraphImage.url;

  return {
    title: `${name} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${name} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [
        {
          url: imageUrl,
          ...(params?.imageUrl ? {} : { width: 1200, height: 630 }),
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },
  };
};

