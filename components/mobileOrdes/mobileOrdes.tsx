"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { MaterialSymbolsAdd } from "@/icons/icons";
import CartCard from "../cartCard/cartCard";
import { useGetOrderProducts } from "@/hooks/orderRequests/useGetOrderProducts";
import LoadingDots from "../loadingDots/loadingDots";
import { Loader, Trash2 } from "lucide-react";
import { Order, OrderProduct } from "@/types/order";
import { EmojioneLeftArrow } from "@/icons/icons";
import { WhatsApp, StreamlineUltimateColorMessagesLogo } from "@/icons/icons";
import MatterCart1Store from "@/store/matterCart1Store";
import { useGetOrderNote } from "@/hooks/orderRequests/useGetOrderNote";
import { useCancelOrder } from "@/hooks/orderRequests/useCancelOrder";
import { openWhatsAppHelp } from "@/utils/whatsapp";

interface MobileOrdesProps {
  orders: Order[];
  fetchOrdersMutation: any;
  updateOrderProducts: (orderId: string, products: OrderProduct[]) => void;
  hasMore: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function MobileOrdes({
  orders,
  fetchOrdersMutation,
  updateOrderProducts,
  hasMore,
  currentPage,
  onPageChange,
}: MobileOrdesProps) {
  const [openOrderIds, setOpenOrderIds] = useState<string[]>([]);
  const { fetchOrderProducts } = useGetOrderProducts();
  const updateFormData = MatterCart1Store((state) => state.updateFormData);
  const { fetchOrderNote } = useGetOrderNote();
  const {
    cancelOrder,
    isLoading: isCancelling,
    variables: cancellingOrderId,
  } = useCancelOrder();
  const [notesByOrder, setNotesByOrder] = useState<
    Record<string, any[] | null>
  >({});
  const [noteLoadingOrderId, setNoteLoadingOrderId] = useState<string | null>(
    null,
  );

  const handleShowInfo = (order: Order) => {
    const hasDelivery = !!(order.direccion && order.direccion.trim() !== "");
    updateFormData({
      showDeliveryOverlay: true,
      overlayDelivery: hasDelivery,
      orderId: order.codigo,
    });
  };

  const fetchOrderProductsMutation = useMutation({
    mutationFn: (orderId: string) => fetchOrderProducts(orderId),
    onSuccess: (products, orderId) => {
      if (products) {
        updateOrderProducts(orderId, products);
      }
    },
  });

  const toggleOrder = async (orderId: string) => {
    const isOpening = !openOrderIds.includes(orderId);

    setOpenOrderIds((prev) =>
      isOpening ? [...prev, orderId] : prev.filter((id) => id !== orderId),
    );

    if (isOpening) {
      const order = orders.find((o) => o.id === orderId);
      if (!notesByOrder[orderId]) {
        setNoteLoadingOrderId(orderId);
        try {
          const note = await fetchOrderNote(orderId);
          setNotesByOrder((prev) => ({ ...prev, [orderId]: note }));
        } finally {
          setNoteLoadingOrderId((prev) => (prev === orderId ? null : prev));
        }
      }
      if (order && (!order.products || order.products.length === 0)) {
        fetchOrderProductsMutation.mutate(orderId);
      }
    }
  };

  const startIndex = (currentPage - 1) * 10;
  const paginatedOrders = orders.slice(startIndex, startIndex + 10);

  return (
    <div className="space-y-4 mt-4 ">
      {!fetchOrdersMutation.isPending &&
        fetchOrdersMutation.status !== "idle" && (
          <>
            {paginatedOrders.map((order) => {
              const isOpen = openOrderIds.includes(order.id);
              return (
                <div key={order.id} className="rounded-2xl overflow-hidden">
                  {/* Order Card */}
                  <div
                    className={`p-5 relative ${
                      isOpen
                        ? "bg-[#022954] text-white rounded-t-2xl"
                        : "bg-[#F5F7FA] rounded-2xl"
                    }`}
                  >
                    {/* Toggle Button - Top Right */}
                    <div className="flex justify-end mb-2">
                      <button
                        onClick={() => toggleOrder(order.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform ${
                          isOpen
                            ? "border-white rotate-45"
                            : "border-[#777777] bg-white"
                        }`}
                      >
                        <MaterialSymbolsAdd
                          style={{ color: isOpen ? "#FFFFFF" : "#777777" }}
                          width={16}
                          height={16}
                        />
                      </button>
                    </div>

                    {/* Order Info */}
                    <div
                      className={`grid grid-cols-2 gap-y-3 items-center font-bold ${isOpen ? "text-white" : "text-[#777777]"}`}
                    >
                      {/* Pedido */}
                      <p className="text-sm sm:text-lg">Pedido</p>
                      <p
                        className={`font-bold text-right  sm:text-xl ${isOpen ? "text-white" : "text-primary"}`}
                      >
                        {order.id.toString().startsWith("#")
                          ? order.id
                          : `#${order.codigo}`}
                      </p>

                      {/* Fecha */}
                      <p className="text-sm sm:text-lg">Fecha</p>
                      <p className=" font-bold text-right sm:text-xl">
                        {order.date}
                      </p>

                      {/* Hora */}
                      <p className="text-sm sm:text-lg">Hora</p>
                      <p className=" font-bold text-right sm:text-xl">
                        {order.time}
                      </p>

                      {/* Teléfono */}
                      <p className="text-sm sm:text-lg">Teléfono</p>
                      <p className=" font-bold text-right sm:text-xl">
                        {order.client_cell?.startsWith("+")
                          ? order.client_cell
                          : "no disponible"}
                      </p>

                      {/* Estado */}
                      <p className="text-sm sm:text-lg">Estado</p>
                      <div className="flex justify-end">
                        <span
                          className={`inline-block px-5 py-2 md:px-8 md:py-3 rounded-full text-sm font-medium ${
                            order.status === "Confirmado"
                              ? "bg-[#2BD530] text-white"
                              : order.status === "En espera"
                                ? "bg-yellow-500 text-white"
                                : "bg-[#D52B2E] text-white"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Información */}
                      <p className="text-sm sm:text-lg">Información</p>
                      <p className=" flex justify-end">
                        <StreamlineUltimateColorMessagesLogo
                          onClick={() => handleShowInfo(order)}
                          className="h-9 w-9 cursor-pointer transition-all duration-300 ease-out hover:scale-110"
                        />
                      </p>

                      {/* Soporte */}
                      <p className="text-sm sm:text-lg">Ayuda</p>
                      <p className=" flex justify-end">
                        <WhatsApp
                          onClick={() => openWhatsAppHelp(order.codigo)}
                          className="h-9 w-9 cursor-pointer transition-all duration-300 ease-out hover:scale-110"
                        />
                      </p>

                      {/* Acciones */}
                      <p className="text-sm sm:text-lg">Acciones</p>
                      <p className="flex justify-end">
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className=" rounded-xl flex items-center justify-center cursor-pointer transition-transform duration-200 ease-out hover:scale-110"
                        >
                          <Trash2
                            className={`w-8.5 h-8.5 ${isOpen ? "text-white" : "text-red-600"} ${
                              isCancelling && cancellingOrderId === order.id
                                ? "animate__animated animate__flash animate__infinite"
                                : ""
                            }`}
                          />
                        </button>
                      </p>
                    </div>
                  </div>

                  {/* Accordion Content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className=" py-6 bg-[#F5F7FA] rounded-b-2xl">
                      <div className="bg-[#F5F7FA] ">
                        <div className=" mx-5 flex flex-col gap-y-3 mb-4 text-[#777777] text-sm sm:text-lg">
                          <div className="flex flex-wrap justify-between items-start gap-x-4">
                            <p className="text-sm sm:text-lg font-bold text-[#022954] tracking-wider shrink-0">
                              Método de entrega
                            </p>
                            <p className="font-bold text-base sm:text-xl `wrap-break-word">
                              {order.direccion && order.direccion.trim() !== ""
                                ? "Domicilio"
                                : "Recogida en tienda"}
                            </p>
                          </div>

                          <div className="flex flex-wrap justify-between items-start gap-x-4">
                            <p className="text-sm sm:text-lg font-bold text-[#022954] tracking-wider shrink-0">
                              Método de pago
                            </p>
                            <p className="font-bold text-base sm:text-xl `wrap-break-word">
                              {order.tipo_pago}
                            </p>
                          </div>

                          <div className="flex flex-wrap justify-between items-start gap-x-4">
                            <p className="text-sm sm:text-lg font-bold text-[#022954] tracking-wider shrink-0">
                              Provincia
                            </p>
                            <p className="font-bold text-base sm:text-xl `wrap-break-word">
                              {order.provincia_completa?.provincia || "-"}
                            </p>
                          </div>

                          <div className="flex flex-wrap justify-between items-start gap-x-4">
                            <p className="text-sm sm:text-lg font-bold text-[#022954] tracking-wider shrink-0">
                              Municipio
                            </p>
                            <p className="font-bold text-base sm:text-xl `wrap-break-word">
                              {order.municipio_completo?.municipio || "-"}
                            </p>
                          </div>

                          <div className="flex flex-wrap justify-between items-start gap-x-4">
                            <p className="text-sm sm:text-lg font-bold text-[#022954] tracking-wider shrink-0">
                              Tienda
                            </p>
                            <p className="font-bold text-base sm:text-xl `wrap-break-word">
                              {order.tienda.name}
                            </p>
                          </div>

                          <div className="flex flex-wrap justify-between items-start gap-x-4">
                            <p className="text-sm sm:text-lg font-bold text-[#022954] tracking-wider shrink-0">
                              Dirección de la tienda
                            </p>
                            <p className="font-bold text-base sm:text-xl `wrap-break-word">
                              {order.tienda.direccion}
                            </p>
                          </div>

                          <div className="flex flex-wrap justify-between items-start gap-x-4">
                            <p className="text-sm sm:text-lg font-bold text-[#022954] tracking-wider shrink-0">
                              Nombre
                            </p>
                            <p className="font-bold text-base sm:text-xl `wrap-break-word">
                              {order.client_name || "No disponible"}
                            </p>
                          </div>

                          <div className="flex flex-wrap justify-between items-start gap-x-4">
                            <p className="text-sm sm:text-lg font-bold text-[#022954] tracking-wider shrink-0">
                              Apellidos
                            </p>
                            <p className="font-bold text-base sm:text-xl `wrap-break-word">
                              {order.client_last_names || "No disponible"}
                            </p>
                          </div>

                          {order.direccion && order.direccion.trim() !== "" && (
                            <div className="flex flex-wrap justify-between items-start gap-x-4">
                              <p className="text-sm sm:text-lg font-bold text-[#022954] tracking-wider shrink-0">
                                Dirección
                              </p>
                              <p className="font-bold text-base sm:text-xl `wrap-break-word">
                                {order.direccion}
                              </p>
                            </div>
                          )}

                          {(noteLoadingOrderId === order.id ||
                            (notesByOrder[order.id] &&
                              notesByOrder[order.id]!.length > 0)) && (
                            <div className="flex flex-col gap-y-2 mt-2">
                              <p className="text-sm sm:text-lg font-bold text-[#022954] tracking-wider shrink-0">
                                Nota del pedido
                              </p>
                              {noteLoadingOrderId === order.id ? (
                                <p className="italic font-bold text-base sm:text-xl wrap-break-word">
                                  Cargando nota...
                                </p>
                              ) : (
                                <div className="flex flex-col gap-1">
                                  {notesByOrder[order.id]!.map(
                                    (notaItem, index) => (
                                      <p
                                        key={notaItem.id}
                                        className="italic font-bold text-base sm:text-xl wrap-break-word"
                                      >
                                        {index + 1}. {notaItem.message}
                                      </p>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="border-t border-snow mt-4"></div>
                      </div>

                      {/* Productos del pedido */}
                      {order.products && order.products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar mx-4 mt-4">
                          {order.products.map((product, idx) => (
                            <CartCard
                              key={idx}
                              brand={product.brand}
                              price={String(product.price)}
                              temporal_price={
                                product.temporal_price
                                  ? String(product.temporal_price)
                                  : undefined
                              }
                              image={product.img}
                              title={product.name}
                              currency={product.currency}
                              padding="p-3 sm:p-4"
                              width="w-full"
                              actionIcon="none"
                              quantityProducts={product.count}
                              hideQuantitySelector={true}
                              bgColor="bg-[#F5F7FA]"
                            />
                          ))}
                        </div>
                      ) : fetchOrderProductsMutation.isPending &&
                        fetchOrderProductsMutation.variables === order.id &&
                        isOpen ? (
                        <div className="w-full flex justify-center items-center mt-4">
                          <Loader
                            className="h-10 w-10 animate-spin text-accent "
                            strokeWidth={3}
                          />
                        </div>
                      ) : (
                        <p className="text-[#777777] text-center py-4 text-sm pr-4 mt-2">
                          No hay productos para mostrar
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {orders.length === 0 && (
              <div className="text-center py-10 text-[#777777] text-sm">
                No se encontraron pedidos.
              </div>
            )}
          </>
        )}

      {(fetchOrdersMutation.isPending ||
        fetchOrdersMutation.status === "idle") && (
        <div className="w-full text-center py-8">
          <LoadingDots
            text="Cargando pedidos"
            size="0.7rem"
            textSize="1.3rem"
            className="text-[#777777] font-bold"
            margin="6px"
          />
        </div>
      )}

      {!fetchOrdersMutation.isPending &&
        fetchOrdersMutation.status !== "idle" && (
          <div className="flex justify-center items-center gap-4 mt-5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || fetchOrdersMutation.isPending}
              className="disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <EmojioneLeftArrow className="h-10 w-10 text-primary cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110" />
            </button>

            <div className="text-primary font-bold text-2xl text-center">
              {currentPage}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasMore || fetchOrdersMutation.isPending}
              className="disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <EmojioneLeftArrow className="h-10 w-10 text-primary cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 rotate-180" />
            </button>
          </div>
        )}
    </div>
  );
}
