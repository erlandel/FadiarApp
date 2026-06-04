import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Compra Electrodomésticos Muebles e Iluminación | Tienda Fadiar",
  description: "Descubre productos de calidad para tu hogar en la tienda oficial de Fadiar. Electrodomésticos, mobiliario e iluminación con envíos a toda Cuba. Compra online fácil y seguro.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}