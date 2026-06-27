import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "animate.css";
import LayoutWrapper from "./layoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grupo Fadiar | Electrodomésticos EON, Energía Solar y Mobiliario para Cuba",
  description: "Encuentra electrodomésticos, mobiliario, sistemas de energía solares,  soluciones para el hogar y los negocios. Garantía real, servicio técnico y envíos a toda Cuba.",
  verification: {
    google: "iziVXgg8234vKYvGu_cHoWAOX6K9nj96NecGPoNvONY",
  },
};
  
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Fadiar",
  url: "https://fadiar.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}