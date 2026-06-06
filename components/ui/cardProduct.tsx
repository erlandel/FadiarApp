"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAddToCart } from "@/hooks/cartRequests/useAddToCart";
import ShoppingCartIcon from "../shoppingCartIcon";
import { CardProps } from "@/types/cardProps";
import useCartStore from "@/store/cartStore";
import { Loader } from "lucide-react";
import { server_url } from "@/urlApi/urlApi";
import useLoadingStore from "@/store/loadingStore";
import WarningMenssage from "@/messages/warningMenssage";

export default function CardProduct({
  category,
  title,
  brand,
  warranty,
  price,
  image,
  position = "horizontal",
  quantityProducts,
  temporal_price,
  productId,
  tiendaId,
  currency,
  count,
  fromBestSelling,
}: CardProps) {
  const router = useRouter();
  const { addToCart, loading } = useAddToCart();
  const [quantity, setQuantity] = useState(Math.max(1, quantityProducts ?? 1));
  const cartItems = useCartStore((state) => state.items);
  const [isInCart, setIsInCart] = useState(false);
  const startLoading = useLoadingStore((state) => state.startLoading);

  useEffect(() => {
    if (productId !== undefined && productId !== null) {
      setIsInCart(cartItems.some((item) => item.productId === productId));
    }
  }, [productId, cartItems]);

  useEffect(() => {
    if (quantityProducts && quantityProducts > 0) {
      const initialQuantity =
        count !== undefined
          ? Math.min(quantityProducts, count)
          : quantityProducts;
      setQuantity(Math.max(1, initialQuantity));
    }
  }, [quantityProducts, count]);

  const handleCardClick = () => {
    if (productId) {
      startLoading();
      const url = `/product/${productId}${fromBestSelling ? "?fromBestSelling=true" : ""}`;
      router.push(url);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const adjustQuantity = (delta: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (count !== undefined && next > count) {
        if (count === 0) {
          WarningMenssage("No hay unidades disponibles");
        } else {
          WarningMenssage(`Solo quedan ${count} unidades disponibles`);
        }
        return prev;
      }
      return next;
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!productId) {
      console.warn("Product without ID cannot be added to cart");
      return;
    }

    addToCart({
      productId: productId,
      title,
      brand,
      category,
      warranty,
      price,
      temporal_price,
      image,
      quantity,
      tiendaId,
    });

    // Opcional: mostrar feedback visual o toast
    console.log(`Added ${quantity} x ${title} to cart`);
  };

  const warrantyNumber = +(warranty ?? "0");

  return (
    <>
      {position === "vertical" ? (
        <div
          id={`product-${productId}`}
          onClick={productId ? handleCardClick : undefined}
          className={`bg-white  h-120 w-full max-w-55   p-3 border border-gray-200 rounded-2xl shadow-sm flex flex-col justify-between gap-3 ${
            productId ? "cursor-pointer transition-shadow hover:shadow-md" : ""
          }`}
        >
          {/* Imagen */}
          <div
            className="relative  w-full overflow-hidden rounded-2xl bg-gray-50 shrink-0"
            style={{ height: "190px" }}
          >
            {count === 0 && (
              <div className="absolute top-2 -right-11 z-30 bg-red-600 text-white text-[10px] font-bold w-32 py-1 rotate-45 shadow-md text-center">
                Agotado
              </div>
            )}
            <img
              className="h-full w-full object-contain"
              alt={title}
              width={500}
              height={500}
              src={`${server_url}/${image}`}
            />
          </div>

          {/* Info del producto */}
          <div className="flex flex-col gap-2 flex-1 overflow-hidden min-h-0">
            <div>
              <p className="text-sm text-[#777777] line-clamp-1">{category}</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-[#022954] line-clamp-2">
                {title}
              </h3>
            </div>
          </div>

          {/* Precio y acciones */}
        <div className="flex flex-col shrink-0 gap-3">
            <p className="text-md text-[#022954] line-clamp-1">{brand}</p>
            {warrantyNumber > 0 ? (
              <p className="text-sm font-medium text-[#D69F04]">
                Garantía de {warrantyNumber / 30} meses
              </p>
            ) : (
              <span className="h-6" />
            )}

            {temporal_price !== null && temporal_price !== undefined ? (
              <div className="flex items-baseline justify-between xl:gap-x-1 xl:gap-y-1 2xl:gap-x-3 2xl:gap-y-1 min-w-0">
                <p className="flex items-baseline xl:text-xl 2xl:text-2xl font-bold text-[#022954] shrink-0">
                  ${temporal_price}
                  <span className="ml-1 text-base font-normal text-[#022954]">
                    {currency?.currency ?? "USD"}
                  </span>
                </p>
                <p className="xl:text-md 2xl:text-lg text-[#777777] line-through truncate min-w-0">
                  ${price} {currency?.currency ?? "USD"}
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap items-baseline gap-2 text-[#022954]  ">
                <p className="flex flex-wrap items-baseline xl:text-xl 2xl:text-2xl font-bold text-[#022954]">
                  ${price}
                  <span className="ml-1 text-base font-normal text-[#022954]">
                    {currency?.currency ?? "USD"}
                  </span>
                </p>
              </div>
            )}

            <div
              className=" flex items-center justify-between xl:gap-3  font-bold"
              onClick={handleButtonClick}
            >
              <div className="flex items-center rounded-xl border border-gray-200 bg-white cursor-default shrink-0">
                <button
                  className="px-3 py-2  text-accent hover:bg-gray-50 transition-colors"
                  aria-label="Restar"
                  onClick={adjustQuantity(-1)}
                >
                  −
                </button>
                <span className="py-1 border-x border-gray-300 w-10 sm:w-10 2xl:w-12 text-center shrink-0">
                  {quantity}
                </span>
                <button
                  className="px-3 py-2  2xl:px-3 2xl:py-2  text-accent hover:bg-gray-50 transition-colors"
                  aria-label="Sumar"
                  onClick={adjustQuantity(1)}
                >
                  +
                </button>
              </div>

              <button
                className={`rounded-xl  border border-primary transition-colors py-2 px-4 sm:px-4 2xl:py-2.5 2xl:px-5 ${
                  count === 0
                    ? "opacity-50 bg-gray-100 text-gray-400 border-gray-300"
                    : loading
                      ? "bg-primary text-white "
                      : isInCart
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white"
                }`}
                onClick={count === 0 || loading ? undefined : handleAddToCart}
                disabled={count === 0 || loading}
              >
                {loading ? (
                  <div className="flex h-5 w-5 items-center justify-center">
                    <Loader className="h-5 w-5 animate-spin" strokeWidth={3} />
                  </div>
                ) : (
                  <ShoppingCartIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Card Horizontal
        <div
          id={`product-${productId}`}
          onClick={productId ? handleCardClick : undefined}
          className={`bg-white  flex w-full h-48 sm:h-58 max-w-115 gap-2 rounded-2xl border border-gray-200 p-2 sm:p-3 shadow-sm sm:flex-row  ${
            productId ? "cursor-pointer transition-shadow hover:shadow-md" : ""
          }`}
        >
          <div className="relative  overflow-hidden rounded-2xl  w-30   sm:shrink-0 lg:w-48  lg:min-w-40">
            {count === 0 && (
              <div className="absolute top-2 -right-11  z-10 bg-red-600 text-white text-[10px] font-bold w-32 py-1 rotate-45 shadow-md text-center">
                Agotado
              </div>
            )}
            <img
              className="h-full w-30 lg:w-48 2xl:w-full object-contain"
              alt={title}
              width={500}
              height={500}
              src={`${server_url}/${image}`}
            />
          </div>

          <div className="flex flex-1 flex-col min-w-0 justify-between">
            <div>

            <div>
              <p className="text-sm text-[#777777] line-clamp-1">{category}</p>
            </div>

            <div className="mb-1 space-y-1">
              <h3 className="text-md font-bold text-primary sm:text-lg line-clamp-1 sm:line-clamp-2">
                {title}
              </h3>
            </div>
            </div>

            <div className="flex flex-col justify-end  gap-1">
              <p className="text-sm text-primary sm:text-md line-clamp-1">
                {brand}
              </p>

              {warrantyNumber > 0 ? (
                <p className=" text-sm font-medium text-[#D69F04]">
                  Garantía de {warrantyNumber / 30} meses
                </p>
              ) : (
                <span className="h-6" />
              )}

              {temporal_price !== null && temporal_price !== undefined ? (
                <div className="flex flex-wrap items-baseline justify-between xl:gap-x-1  2xl:gap-x-3 ">
                  <p className="flex items-baseline xl:text-xl 2xl:text-2xl font-bold text-[#022954]">
                    ${temporal_price}
                    <span className="ml-1 text-base font-normal text-[#022954]">
                      {currency?.currency ?? "USD"}
                    </span>
                  </p>
                  <p className="xl:text-md 2xl:text-lg text-[#777777] line-through">
                    ${price} {currency?.currency ?? "USD"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap items-baseline gap-2 text-[#022954]">
                  <p className="xl:text-xl 2xl:text-2xl font-bold ">${price}</p>
                  <span className="text-base font-normal">
                    {currency?.currency ?? "USD"}
                  </span>
                </div>
              )}

              <div
                className="mt-1 flex items-center justify-between gap-3 font-bold px-2"
                onClick={handleButtonClick}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center rounded-xl border border-gray-200 font-bold cursor-default shrink-0">
                    <button
                      className="px-2 py-1.5 sm:px-3 sm:py-2   2xl:px-3 2xl:py-2  text-accent hover:bg-gray-50 transition-colors"
                      aria-label="Restar"
                      onClick={adjustQuantity(-1)}
                    >
                      −
                    </button>
                    <span className="py-1 border-x border-gray-300 w-8 sm:w-10 2xl:w-12 text-center shrink-0">
                      {quantity}
                    </span>
                    <button
                      className="px-2 py-1.5 sm:px-3 sm:py-2   2xl:px-3 2xl:py-2  text-accent hover:bg-gray-50 transition-colors"
                      aria-label="Sumar"
                      onClick={adjustQuantity(1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className={`rounded-xl  border border-primary transition-colors py-2 px-3 sm:px-4  2xl:py-2.5 2xl:px-5 ${
                      count === 0
                        ? "opacity-50 bg-gray-100 text-gray-400 border-gray-300"
                        : loading
                          ? "bg-primary text-white"
                          : isInCart
                            ? "bg-primary text-white"
                            : "hover:bg-primary hover:text-white"
                    }`}
                    onClick={
                      count === 0 || loading ? undefined : handleAddToCart
                    }
                    disabled={count === 0 || loading}
                  >
                    {loading ? (
                      <div className="flex h-5 w-5 items-center justify-center">
                        <Loader
                          className="h-5 w-5 animate-spin"
                          strokeWidth={3}
                        />
                      </div>
                    ) : (
                      <ShoppingCartIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>


          </div>
        </div>
      )}
    </>
  );
}
