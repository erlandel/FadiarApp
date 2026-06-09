
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
      title: "Grupo Fadiar | Electrodomésticos EON, Energía Solar y Mobiliario para Cuba",
    description:
      "Grupo Fadiar ofrece electrodomésticos, mobiliario, sistemas solares y soluciones para el hogar y los negocios. Garantía real, servicio técnico y envíos a toda Cuba.",
    alternates: {
      canonical: `${SITE_URL}/`,
    },
    openGraph: {
      title: "Grupo Fadiar | Electrodomésticos EON, Energía Solar y Mobiliario para Cuba",
      description:
        "Grupo Fadiar ofrece electrodomésticos, mobiliario, sistemas solares y soluciones para el hogar y los negocios. Garantía real, servicio técnico y envíos a toda Cuba.",
      url: `${SITE_URL}/`,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Grupo Fadiar | Electrodomésticos EON, Energía Solar y Mobiliario para Cuba",
      description:
        "Grupo Fadiar ofrece electrodomésticos, mobiliario, sistemas solares y soluciones para el hogar y los negocios. Garantía real, servicio técnico y envíos a toda Cuba.",
      images: [defaultOpenGraphImage.url],
    },
  },

  "/products": {
    title: "Productos | Grupo Fadiar",
    description:
      "Explora el catálogo completo de Fadiar: electrodomésticos, muebles e iluminación. Filtra por categorías y encuentra lo que necesitas.",
    alternates: {
      canonical: `${SITE_URL}/products`,
    },
    openGraph: {
      title: "Productos | Grupo Fadiar",
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
      title: "Productos | Grupo Fadiar",
      description:
        "Explora el catálogo completo de Fadiar: electrodomésticos, muebles e iluminación.",
      images: [defaultOpenGraphImage.url],
    },
  },

  "/about": {
    title: "Sobre Nosotros | Grupo Fadiar",
    description:
      "Conoce al Grupo Fadiar: nuestra misión, valores y compromiso con la calidad y el servicio. Soluciones para el hogar con envíos a Cuba.",
    alternates: {
      canonical: `${SITE_URL}/about`,
    },
    openGraph: {
      title: "Sobre Nosotros | Grupo Fadiar",
      description:
        "Conoce al Grupo Fadiar: misión, valores y compromiso con la calidad y el servicio.",
      url: `${SITE_URL}/about`,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sobre Nosotros | Grupo Fadiar",
      description:
        "Conoce al Grupo Fadiar: misión, valores y compromiso con la calidad y el servicio.",
      images: [defaultOpenGraphImage.url],
    },
  },

  "/contact": {
    title: "Contacto | Grupo Fadiar",
    description:
      "Ponte en contacto con el Grupo Fadiar para soporte, consultas y seguimiento. Estamos para ayudarte.",
    alternates: {
      canonical: `${SITE_URL}/contact`,
    },
    openGraph: {
      title: "Contacto | Grupo Fadiar",
      description: "Soporte, consultas y seguimiento con el equipo de Fadiar.",
      url: `${SITE_URL}/contact`,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Contacto | Grupo Fadiar",
      description: "Soporte, consultas y seguimiento con el equipo del Grupo Fadiar.",
      images: [defaultOpenGraphImage.url],
    },
  },

  "/faq": {
    title: "Preguntas Frecuentes | Grupo Fadiar",
    description:
      "Resuelve tus dudas sobre compras, pagos, envíos y garantías en la tienda del  Grupo Fadiar.",
    alternates: {
      canonical: `${SITE_URL}/faq`,
    },
    openGraph: {
      title: "Preguntas Frecuentes | Grupo Fadiar",
      description: "Dudas sobre compras, pagos, envíos y garantías en el Grupo Fadiar.",
      url: `${SITE_URL}/faq`,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Preguntas Frecuentes | Grupo Fadiar",
      description: "Dudas sobre compras, pagos, envíos y garantías en el Grupo Fadiar.",
      images: [defaultOpenGraphImage.url],
    },
  },

  "/shipping": {
    title: "Envíos | Grupo Fadiar",
    description:
      "Información sobre envíos, cobertura y tiempos de entrega del Grupo Fadiar. Recibe tus compras de forma segura.",
    alternates: {
      canonical: `${SITE_URL}/shipping`,
    },
    openGraph: {
      title: "Envíos | Grupo Fadiar",
      description: "Cobertura, tiempos de entrega y detalles de envío en el Grupo Fadiar.",
      url: `${SITE_URL}/shipping`,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Envíos  | Grupo Fadiar",
      description: "Cobertura, tiempos de entrega y detalles de envío en el Grupo Fadiar.",
      images: [defaultOpenGraphImage.url],
    },
  },

  "/warranty": {
    title: "Garantía | Grupo Fadiar",
    description:
      "Consulta la política de garantía del Grupo Fadiar y los pasos para solicitar soporte si tu producto lo requiere.",
    alternates: {
      canonical: `${SITE_URL}/warranty`,
    },
    openGraph: {
      title: "Garantía | Grupo Fadiar",
      description: "Política de garantía y soporte postventa en el Grupo Fadiar.",
      url: `${SITE_URL}/warranty`,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Garantía | Grupo Fadiar",
      description: "Política de garantía y soporte postventa en el Grupo Fadiar.",
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
    "Descubre detalles, precio y disponibilidad del producto en la Grupo de Fadiar.";
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

