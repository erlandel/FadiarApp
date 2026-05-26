"use client";

import { X, Plus, Minus } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { server_url } from "@/urlApi/urlApi";

interface ImageViewerProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageViewer({ images, initialIndex, isOpen, onClose }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [positionStart, setPositionStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const lastPinchDist = useRef<number | null>(null);
  const pinchInitialScale = useRef<number>(1);

  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (scale === 1) setPosition({ x: 0, y: 0 });
  }, [scale]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.3 : 0.3;
    setScale((prev) => Math.min(5, Math.max(1, prev + delta)));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isOpen) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
      else if (e.key === "ArrowRight") setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, images.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPositionStart({ ...position });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: positionStart.x + (e.clientX - dragStart.x),
      y: positionStart.y + (e.clientY - dragStart.y),
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastPinchDist.current = dist;
      pinchInitialScale.current = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setPositionStart({ ...position });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastPinchDist.current !== null) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setScale(Math.min(5, Math.max(1, pinchInitialScale.current * (dist / lastPinchDist.current))));
    } else if (e.touches.length === 1 && isDragging) {
      setPosition({
        x: positionStart.x + (e.touches[0].clientX - dragStart.x),
        y: positionStart.y + (e.touches[0].clientY - dragStart.y),
      });
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isOpen) return;
    const handler = (e: TouchEvent) => {
      if (e.touches.length === 2) e.preventDefault();
    };
    el.addEventListener("touchmove", handler, { passive: false });
    return () => el.removeEventListener("touchmove", handler);
  }, [isOpen]);

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastPinchDist.current = null;
  };

  const zoomIn = () => setScale((prev) => Math.min(5, Math.round((prev + 0.3) * 10) / 10));
  const zoomOut = () => setScale((prev) => Math.max(1, Math.round((prev - 0.3) * 10) / 10));

  if (!isOpen || !images.length) return null;

  return (
    <div
      className="fixed inset-0 z-100 h-svh bg-black/80 backdrop-blur-sm flex flex-col select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full flex-1 flex flex-col min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Mobile: barra superior con zoom + X en la misma fila ── */}
        <div className="md:hidden flex items-center justify-between px-4 pt-5 pb-2 shrink-0">
          <div className="w-10" />
          <div className="flex items-center gap-2 bg-black/60 rounded-full px-4 py-1.5">
            <button
              onClick={zoomOut}
              disabled={scale <= 1}
              className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Alejar"
            >
              <Minus className="w-5 h-5" strokeWidth={3} />
            </button>
            <span className="text-white text-sm font-semibold min-w-12 text-center tabular-nums">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={scale >= 5}
              className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Acercar"
            >
              <Plus className="w-5 h-5" strokeWidth={3} />
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-7 h-7 text-white" strokeWidth={3} />
          </button>
        </div>

        {/* ── PC: X fija arriba a la derecha (comportamiento original) ── */}
        <button
          onClick={onClose}
          className="hidden md:block fixed top-6 right-6 p-2.5 rounded-full transition-colors cursor-pointer z-50"
          aria-label="Cerrar"
        >
          <X className="w-7 h-7 text-white" strokeWidth={3} />
        </button>

        {/* Contenido principal */}
        <div className="flex md:flex-row flex-1 min-h-0 px-4 md:px-8 gap-3 md:gap-4 md:py-5">
          {/* Miniaturas PC (izquierda, vertical) */}
          {images.length > 1 && (
            <div className="hidden md:flex flex-col gap-3 items-center justify-center shrink-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-40 h-40 rounded-md overflow-hidden shrink-0 transition-all cursor-pointer ${
                    i === currentIndex
                      ? "border-2 border-accent shadow-2xl shadow-accent/80"
                      : "border border-gray-400 hover:border-gray-200"
                  }`}
                  aria-label={`Ir a imagen ${i + 1}`}
                >
                  <img
                    src={`${server_url}/${img}`}
                    alt=""
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Columna imagen */}
          <div className="flex flex-col flex-1 min-h-0 justify-center">
            {/* Zoom PC (centrado sobre la imagen) */}
            <div className="hidden md:flex items-center justify-center mb-2 shrink-0">
              <div className="flex items-center gap-2 bg-black/60 rounded-full px-4 py-1.5">
                <button
                  onClick={zoomOut}
                  disabled={scale <= 1}
                  className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Alejar"
                >
                  <Minus className="w-4 h-4" strokeWidth={3} />
                </button>
                <span className="text-white text-xs font-semibold min-w-10 text-center tabular-nums">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  disabled={scale >= 5}
                  className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Acercar"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Contenedor imagen */}
            <div
              ref={containerRef}
              className="relative flex-1 min-h-0 flex items-center justify-center overflow-hidden touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
            >
              <img
                src={`${server_url}/${images[currentIndex]}`}
                alt=""
                className="max-w-full max-h-full object-contain pointer-events-none"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Miniaturas mobile (abajo) */}
        {images.length > 1 && (
          <div className="md:hidden flex gap-3 justify-center pt-3 pb-3 shrink-0">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-24 h-24 rounded-md overflow-hidden shrink-0 transition-all cursor-pointer ${
                  i === currentIndex
                    ? "border-2 border-accent shadow-2xl shadow-accent/80"
                    : "border border-gray-400 hover:border-gray-200"
                }`}
                aria-label={`Ir a imagen ${i + 1}`}
              >
                <img
                  src={`${server_url}/${img}`}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}