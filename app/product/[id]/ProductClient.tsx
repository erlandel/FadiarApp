"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { BannerMobilePay } from "@/components/banner/bannerMobilePay";
import ShoppingCartIcon from "@/components/shoppingCartIcon";
import { useAddToCart } from "@/hooks/cartRequests/useAddToCart";
import useCartStore from "@/store/cartStore";
import { LatestProducts } from "@/sections/sectionsProducts/latestProducts";
import { ProductID } from "@/types/productId";
import RelatedProds from "@/sections/sectionsProducts/relatedProds";
import { BestSelling } from "@/sections/sectionsProducts/bestSelling";
import { useInventory } from "@/hooks/productRequests/useInventory";
import { useBestSelling } from "@/hooks/productRequests/useBestSelling";
import { useUpcomingProducts } from "@/hooks/productRequests/useUpcomingProducts";
import { Loader } from "lucide-react";
import ImageViewer from "@/components/ui/imageViewer/ImageViewer";
import { server_url } from "@/urlApi/urlApi";
import useLoadingStore from "@/store/loadingStore";
import WarningMenssage from "@/messages/warningMenssage";
import { useSearchParams } from "next/navigation";
import SkeletonProductID from "@/components/ui/skeletonProductID";

interface ProductClientProps {
  id: string;
}

export default function ProductClient({ id }: ProductClientProps) {
  const searchParams = useSearchParams();
  const preSaleParam = searchParams.get("preSale");
  const isPreSale = preSaleParam === "true";
  const fromBestSelling = searchParams.get("fromBestSelling") === "true";

  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const { addToCart, loading } = useAddToCart();
  const cartItems = useCartStore((state) => state.items);
  const [isInCart, setIsInCart] = useState(false);

  const { data: inventoryData, isLoading: isInventoryLoading } = useInventory();
  const { data: bestSellingProducts, isLoading: isBestSellingLoading } = useBestSelling(10);
  const { data: upcomingProducts, isLoading: isUpcomingLoading } = useUpcomingProducts();

  const allProducts = useMemo(() => {
    if (isPreSale) {
      return (upcomingProducts || []) as unknown as ProductID[];
    }

    const inventoryProds = (inventoryData?.products || []) as unknown as ProductID[];

    if (!fromBestSelling) {
      return inventoryProds;
    }

    const bestSellingProds = (bestSellingProducts || []) as unknown as ProductID[];
    const combinedProducts = [...inventoryProds];

    bestSellingProds.forEach((bsProduct) => {
      const existsInInventory = inventoryProds.some(
        (invProduct) => String(invProduct.id) === String(bsProduct.id)
      );
      if (!existsInInventory) {
        combinedProducts.push({
          ...bsProduct,
          count: 0,
        });
      }
    });

    return combinedProducts;
  }, [isPreSale, upcomingProducts, inventoryData, bestSellingProducts, fromBestSelling]);

  const inventoryProducts = useMemo(
    () => (inventoryData?.products || []) as unknown as ProductID[],
    [inventoryData]
  );

  const isLoading = isPreSale ? isUpcomingLoading : isInventoryLoading || isBestSellingLoading;
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const stopLoading = useLoadingStore((state) => state.stopLoading);

  useEffect(() => {
    setIsLoading(isLoading);
    return () => setIsLoading(false);
  }, [isLoading, setIsLoading]);

  useEffect(() => {
    if (!isLoading) {
      stopLoading();
    }
  }, [id, isPreSale, fromBestSelling, isLoading, stopLoading]);

  const product = useMemo(() => {
    if (!allProducts.length || !id) return null;
    return allProducts.find((p) => p.id.toString() === id.toString()) || null;
  }, [allProducts, id]);

  useEffect(() => {
    if (isPreSale) return;
    if (product?.id !== undefined && product?.id !== null) {
      setIsInCart(cartItems.some((item) => item.productId === product.id));
    }
  }, [product?.id, cartItems, product, isPreSale]);

  useEffect(() => {
    if (product?.img) {
      setSelectedImage(product.img);
    }
  }, [product?.id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    const sourceProducts =
      inventoryProducts && inventoryProducts.length > 0 ? inventoryProducts : allProducts;

    const sameCategory = sourceProducts.filter(
      (item) =>
        item.id !== product.id &&
        (item.categoria?.id || item.categoria?.name) ===
          (product.categoria?.id || product.categoria?.name)
    );

    if (sameCategory.length >= 6) {
      return sameCategory.slice(0, 6);
    }

    const remaining = sourceProducts.filter(
      (item) => item.id !== product.id && !sameCategory.includes(item)
    );
    return [...sameCategory, ...remaining].slice(0, 6);
  }, [allProducts, inventoryProducts, product]);

  const warrantyNumber = product ? Number(product.warranty ?? 0) : 0;
  const warrantyMonths = warrantyNumber > 0 ? warrantyNumber / 30 : 0;

  const handleAddToCart = () => {
    if (!product) return;

    const itemToAdd = {
      productId: product.id,
      title: product.name,
      brand: product.brand,
      category: product.categoria?.name,
      warranty: product.warranty,
      price: product.price,
      temporal_price: product.temporal_price,
      image: product.img,
      quantity: qty,
      tiendaId: product.tiendaId,
      count: product.count,
    };

    addToCart(itemToAdd);
    console.log(`Added ${qty} x ${product.name} to cart`);
  };

  const images = product ? [product.img, product.img, product.img] : [];

  return (
    <main>
      {isLoading ? (
        <SkeletonProductID />
      ) : !product ? (
        <div className="px-4 md:px-20 2xl:px-36 mt-10 min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Producto no encontrado</h1>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              Volver atrás
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="px-4 md:px-20 2xl:px-36 mt-10">
            <div id={"list"} className="mt-10">
              <p className="text-xs text-gray-400 mb-4">
                <Link href="/" className="text-gray-400 cursor-pointer">
                  Inicio -{" "}
                </Link>
                <Link href="/products" className="text-gray-400 cursor-pointer">
                  Productos -
                </Link>
                <span className="text-primary font-semibold">{product.categoria?.name}</span>
              </p>
              <h1 className="text-3xl text-primary font-bold">Detalles del Producto</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-16 mt-10">
              <div className="md:w-1/3">
                <div className="relative w-fit mx-auto h-[400px] rounded-xl overflow-hidden flex items-center justify-center bg-gray-50">
                  {product.count === 0 && !isPreSale && (
                    <div className="absolute top-4 -right-11 z-10 bg-red-600 text-white text-md font-bold w-40 py-1 rotate-45 shadow-md text-center">
                      Agotado
                    </div>
                  )}
                  {isPreSale && (
                    <div className="absolute top-4 -right-11 z-10 bg-accent text-white text-md font-bold w-40 py-1 rotate-45 shadow-md text-center">
                      Pronto
                    </div>
                  )}

                  <Image
                    src={`${server_url}/${selectedImage || product.img}`}
                    alt={product.name}
                    width={613}
                    height={682}
                    unoptimized
                    className="w-auto h-full rounded-xl object-contain cursor-pointer"
                    onClick={() => {
                      const idx = images.findIndex((img) => img === (selectedImage || product.img));
                      setViewerIndex(idx >= 0 ? idx : 0);
                      setIsImageViewerOpen(true);
                    }}
                  />
                </div>
                
              {/* Miniaturas de la imagen */}
            
                {/* <div className="flex gap-2 mt-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedImage(img);
                        setViewerIndex(i);
                      }}
                      className={`w-20 h-20 rounded-md border-2 cursor-pointer overflow-hidden transition-all ${
                        selectedImage === img
                          ? "border-blue-500"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      <Image
                        src={`${server_url}/${img}`}
                        alt={`Miniatura ${i + 1} de ${product.name}`}
                        width={80}
                        height={80}
                        unoptimized
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div> */}


              </div>

              <div className="md:w-2/3">
                <p className="text-sm text-gray-500 mb-3">
                  {product.categoria?.name || "Sin categoría"}
                </p>
                <h2 className="text-4xl font-bold text-[#1A2B49]">{product.name}</h2>
                <p className="text-3xl text-[#022954] font-medium">{product.brand}</p>

                {product.description && (
                  <p className="text-[#1E1E1E] text-md sm:text-lg mt-3 text-justify">
                    {product.description}
                  </p>
                )}

                {warrantyMonths > 0 && (
                  <p className="text-yellow-500 font-semibold text-md mt-2">
                    Garantía de {warrantyMonths} meses
                  </p>
                )}

                <div className="mt-3 flex items-center gap-4">
                  {product.temporal_price ? (
                    <>
                      <p className="text-3xl font-bold text-primary">
                        ${product.temporal_price} {product.currency?.currency}
                      </p>
                      <p className="text-gray-400 line-through text-lg">
                        ${product.price} {product.currency?.currency}
                      </p>
                    </>
                  ) : (
                    <p className="text-3xl font-bold text-primary">
                      ${product.price} {product.currency?.currency}
                    </p>
                  )}
                </div>

                {!isPreSale && (
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-xl border border-primary font-bold">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="px-5 py-3 text-yellow-500 hover:bg-gray-100 rounded-l-xl"
                      >
                        −
                      </button>
                      <span className="px-4 my-1 border-x border-gray-300">{qty}</span>
                      <button
                        onClick={() => {
                          if (product.count !== undefined) {
                            if (qty + 1 > product.count) {
                              if (product.count === 0) {
                                WarningMenssage("No hay unidades disponibles");
                              } else {
                                WarningMenssage(`Solo quedan ${product.count} unidades disponibles`);
                              }
                            } else {
                              setQty(qty + 1);
                            }
                          } else {
                            setQty(qty + 1);
                          }
                        }}
                        className="px-5 py-3 text-yellow-500 hover:bg-gray-100 rounded-r-xl"
                      >
                        +
                      </button>
                    </div>

                    <button
                      className={`rounded-xl border border-primary transition-colors px-10 py-3 ${
                        product.count === 0
                          ? "opacity-50 bg-gray-100 text-gray-400 border-gray-300"
                          : loading
                            ? "bg-primary text-white"
                            : isInCart
                              ? "bg-primary text-white"
                              : "hover:bg-primary hover:text-white"
                      }`}
                      onClick={product.count === 0 || loading ? undefined : handleAddToCart}
                      disabled={product.count === 0 || loading}
                    >
                      {loading ? (
                        <div className="flex h-6 w-6 items-center justify-center">
                          <Loader className="h-6 w-6 animate-spin" strokeWidth={3} />
                        </div>
                      ) : (
                        <ShoppingCartIcon className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                )}

                {product.specs && product.specs.length > 0 && (
                  <div className="mt-8 bg-[#F5F7FA] rounded-xl p-5 border border-gray">
                    <h3 className="font-semibold text-[#1A2B49] mb-3">Propiedades</h3>
                    <table className="w-full text-sm text-gray-600 table-fixed">
                      <tbody>
                        {product.specs.map((p, i) => (
                          <tr key={i} className="border-b border-gray">
                            <td className="py-2 sm:font-medium text-[#1E1E1E] text-sm sm:text-base wrap-break-word max-w-[50%]">
                              {p.name}
                            </td>
                            <td className="py-2 text-right text-sm sm:text-base wrap-break-word max-w-[50%] whitespace-normal">
                              {p.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-20">
            <RelatedProds products={relatedProducts} />
          </div>
        </>
      )}

      <div className="mt-20">
        <BannerMobilePay />
      </div>

      <div className="hidden xl:block">
        <LatestProducts />
      </div>

      <div className="xl:hidden">
        <BestSelling />
      </div>

      {product && (
        <ImageViewer
          images={images}
          initialIndex={viewerIndex}
          isOpen={isImageViewerOpen}
          onClose={() => setIsImageViewerOpen(false)}
        />
      )}
    </main>
  );
}
