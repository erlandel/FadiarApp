"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  EmojioneLeftArrow,
  MaterialSymbolsAdd,
  WhatsApp,
  StreamlineUltimateColorMessagesLogo,
} from "@/icons/icons";
import CartCard from "../cartCard/cartCard";
import LoadingDots from "@/components/loadingDots/loadingDots";
import { useGetOrderProducts } from "@/hooks/orderRequests/useGetOrderProducts";
import { useGetOrderNote } from "@/hooks/orderRequests/useGetOrderNote";
import { useCancelOrder } from "@/hooks/orderRequests/useCancelOrder";
import { Loader, Trash2 } from "lucide-react";
import { Order, OrderProduct } from "@/types/order";
import MatterCart1Store from "@/store/matterCart1Store";
import { openWhatsAppHelp } from "@/utils/whatsapp";

interface OrdersTableProps {
  orders: Order[];
  fetchOrdersMutation: any;
  updateOrderProducts: (orderId: string, products: OrderProduct[]) => void;
  updateOrderNote: (orderId: string, nota: Order["nota"]) => void;
  hasMore: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function OrdersTable({
  orders,
  fetchOrdersMutation,
  updateOrderProducts,
  updateOrderNote,
  hasMore,
  currentPage,
  onPageChange,
}: OrdersTableProps) {
  const [openOrderIds, setOpenOrderIds] = useState<string[]>([]);
  const { fetchOrderProducts } = useGetOrderProducts();
  const { fetchOrderNote } = useGetOrderNote();
  const {
    cancelOrder,
    isLoading: isCancelling,
    variables: cancellingOrderId,
  } = useCancelOrder();
  const updateFormData = MatterCart1Store((state) => state.updateFormData);

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

  const fetchOrderNoteMutation = useMutation({
    mutationFn: (orderId: string) => fetchOrderNote(orderId),
    onSuccess: (note, orderId) => {
      if (note) {
        updateOrderNote(orderId, note);
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
      if (order) {
        if (!order.products || order.products.length === 0) {
          fetchOrderProductsMutation.mutate(orderId);
        }
        if (!order.nota) {
          fetchOrderNoteMutation.mutate(orderId);
        }
      }
    }
  };

  const startIndex = (currentPage - 1) * 10;
  const paginatedOrders = orders.slice(startIndex, startIndex + 10);

  return (
    <>
      <div>
        {!fetchOrdersMutation.isPending &&
          fetchOrdersMutation.status !== "idle" && (
            <>
              {/* Table Header */}
              {orders.length > 0 && (
                <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr_1fr_1fr_1fr_80px_80px] gap-4 px-6 py-4 font-bold  text-[#777777] items-center">
                  <div className="text-center">Pedido</div>
                  <div className="text-center">Fecha</div>
                  <div className="text-center">Hora</div>
                  <div className="text-center">Teléfono</div>
                  <div className="text-center">Estado</div>
                  <div className="text-center">Información</div>
                  <div className="text-center">Ayuda</div>
                  <div className="text-center">Acciones</div>
                  <div></div>
                </div>
              )}

              <div>
                {paginatedOrders.map((order) => {
                  const isOpen = openOrderIds.includes(order.id);
                  return (
                    <div key={order.id} className="py-2 ">
                      {/* Order Row */}
                      <div
                        className={`grid grid-cols-[1fr_1fr_1fr_1.5fr_1fr_1fr_1fr_80px_80px] gap-4 px-6 py-4 items-center transition-colors ${
                          isOpen
                            ? "bg-[#022954] text-white rounded-t-xl"
                            : "bg-[#F5F7FA] text-[#777777] rounded-2xl"
                        }`}
                      >
                        <div
                          className={`font-bold text-xl text-center ${
                            !isOpen && "text-[#022954]"
                          }`}
                        >
                          {order.id.toString().startsWith("#")
                            ? order.id
                            : `#${order.codigo}`}
                        </div>
                        <div className="text-center">{order.date}</div>
                        <div className="text-center">{order.time}</div>
                        <div className="text-center">
                          {order.client_cell?.startsWith("+")
                            ? order.client_cell
                            : "no disponible"}
                        </div>
                        <div className="text-center">
                          <span
                            className={`inline-block px-5 py-2 rounded-full text-md font-medium ${
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
                        <div className="flex justify-center ">
                          <StreamlineUltimateColorMessagesLogo
                            onClick={() => handleShowInfo(order)}
                            className="h-10 w-10 cursor-pointer    transition-all duration-300 ease-out hover:scale-110 "
                          />
                        </div>
                        <div className="flex justify-center ">
                          <WhatsApp
                            onClick={() => openWhatsAppHelp(order.codigo)}
                            className="h-9.5 w-9.5 cursor-pointer    transition-all duration-300 ease-out hover:scale-110 "
                          />
                        </div>
                        <div className="flex justify-center ">
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="rounded-xl flex items-center justify-center cursor-pointer transition-transform duration-200 ease-out hover:scale-110"
                          >
                            <Trash2
                              className={`w-8.5 h-8.5 ${isOpen ? "text-white" : "text-red-600"} ${
                                isCancelling && cancellingOrderId === order.id
                                  ? "animate__animated animate__flash animate__infinite"
                                  : ""
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex justify-center ">
                          <button
                            onClick={() => toggleOrder(order.id)}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform cursor-pointer ${
                              isOpen
                                ? "border-white rotate-45"
                                : "border-[#777777] "
                            }`}
                          >
                            <MaterialSymbolsAdd
                              style={{ color: isOpen ? "#FFFFFF" : "#777777" }}
                              width={20}
                              height={20}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Accordion Content */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen
                            ? "max-h-[800px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {/* Client and Store Information */}
                        <div className="bg-[#F5F7FA]">
                          <div className="pt-4  flex flex-wrap justify-between gap-y-6 gap-x-4 mb-6  text-[#777777] px-5">
                            {/* Row 1 Header style: Labels on top, values below */}
                            <div className="flex flex-col gap-1 ">
                              <span className="font-bold text-[#022954]  tracking-wider ">
                                Método de entrega
                              </span>
                              <span className="wrap-break-word text-md">
                                {order.direccion &&
                                order.direccion.trim() !== ""
                                  ? "Domicilio"
                                  : "Recogida en tienda"}
                              </span>
                            </div>

                            <div className="flex flex-col gap-1 ">
                              <span className="font-bold text-[#022954]  tracking-wider ">
                                Método de pago
                              </span>
                              <span className="wrap-break-word text-md">
                                {order.tipo_pago}
                              </span>
                            </div>

                            <div className="flex flex-col gap-1 ">
                              <span className="font-bold text-[#022954]  tracking-wider ">
                                Provincia
                              </span>
                              <span className="wrap-break-word text-md">
                                {order.provincia_completa?.provincia || "-"}
                              </span>
                            </div>

                            <div className="flex flex-col gap-1 ">
                              <span className="font-bold text-[#022954]  tracking-wider ">
                                Municipio
                              </span>
                              <span className="wrap-break-word text-md">
                                {order.municipio_completo?.municipio || "-"}
                              </span>
                            </div>
                          </div>

                          <div className="mx-2 space-y-4">
                            <div className="w-full   justify-between items-center  mt-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                              <div className="flex  items-center gap-2 ">
                                <span className="font-bold text-[#022954] tracking-wider whitespace-nowrap">
                                  Tienda:
                                </span>
                                <span className="wrap-break-word text-md text-[#444444]">
                                  {order.tienda.name}
                                </span>
                              </div>

                              <div className="flex  items-center gap-2 mt-1 ">
                                <span className="font-bold text-[#022954] tracking-wider whitespace-nowrap">
                                  Dirección de la tienda:
                                </span>
                                <span className="wrap-break-word text-md text-[#444444]">
                                  {order.tienda.direccion}
                                </span>
                              </div>
                            </div>

                            <div className="w-full   justify-between items-center  mt-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                              <div className="flex  items-center gap-2 ">
                                <span className="font-bold text-[#022954] tracking-wider whitespace-nowrap">
                                  Nombre:
                                </span>
                                <span className="wrap-break-word text-md text-[#444444]">
                                  {order.client_name}
                                </span>
                              </div>

                              <div className="flex  items-center gap-2 mt-1 ">
                                <span className="font-bold text-[#022954] tracking-wider whitespace-nowrap">
                                  Apellidos:
                                </span>
                                <span className="wrap-break-word text-md text-[#444444]">
                                  {order.client_last_names}
                                </span>
                              </div>
                            </div>

                            {order.direccion &&
                              order.direccion.trim() !== "" && (
                                <div className="flex items-center gap-2  bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                  <span className="font-bold text-[#022954] text-md tracking-wider whitespace-nowrap">
                                    Dirección:
                                  </span>
                                  <span className="wrap-break-word text-md text-[#444444]">
                                    {order.direccion}
                                  </span>
                                </div>
                              )}

                            {order.nota && order.nota.length > 0 && (
                              <div className="flex flex-col gap-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                <span className="font-bold text-[#022954] text-md tracking-wider whitespace-nowrap">
                                  Nota del pedido:
                                </span>
                                <div className="flex flex-col gap-1">
                                  {order.nota.map((notaItem, index) => (
                                    <span
                                      key={notaItem.id}
                                      className="italic wrap-break-word text-md text-[#444444]"
                                    >
                                      {index + 1}. {notaItem.message}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="border-t border-snow mt-4"></div>
                        </div>

                        <div className="pl-6 pr-0 py-6 bg-[#F5F7FA] rounded-b-xl">
                          {order.products && order.products.length > 0 ? (
                            <div className="max-h-[350px] overflow-y-auto custom-scrollbar pr-6">
                              <div className="grid grid-cols-1 md:grid-cols-2  gap-2">
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
                                    width="w-92"
                                    actionIcon="none"
                                    quantityProducts={product.count}
                                    hideQuantitySelector={true}
                                    bgColor="bg-[#F5F7FA]"
                                  />
                                ))}
                              </div>
                            </div>
                          ) : fetchOrderProductsMutation.isPending &&
                            fetchOrderProductsMutation.variables === order.id &&
                            isOpen ? (
                            <div className="w-full flex justify-center items-center ">
                              <Loader
                                className="h-10 w-10 animate-spin text-accent "
                                strokeWidth={3}
                              />
                            </div>
                          ) : (
                            <p className="text-[#777777] text-center py-4 pr-6">
                              No hay productos para mostrar
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {orders.length === 0 && (
                <div className="text-center py-10 text-[#777777]">
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
              size="1.5rem"
              textSize="2rem"
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
    </>
  );
}
