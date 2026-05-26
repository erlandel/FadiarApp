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
    if (scale === 1) {
      setPosition({ x: 0, y: 0 });
    }
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
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
      }
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
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setPosition({
      x: positionStart.x + dx,
      y: positionStart.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
      const ratio = dist / lastPinchDist.current;
      const newScale = Math.min(5, Math.max(1, pinchInitialScale.current * ratio));
      setScale(newScale);
    } else if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStart.x;
      const dy = e.touches[0].clientY - dragStart.y;
      setPosition({
        x: positionStart.x + dx,
        y: positionStart.y + dy,
      });
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isOpen) return;
    const handler = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
      }
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

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
  };

  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-100 w-full h-dvh bg-black/80 backdrop-blur-sm flex select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="fixed top-6 right-6 p-2.5 rounded-full transition-colors cursor-pointer z-50"
          aria-label="Cerrar"
        >
          <X className="w-7 h-7 text-white" strokeWidth={3} />
        </button>

        {/* Main content: thumbnails + image */}
        <div className="flex md:flex-row flex-1 min-h-0 px-4 md:px-8 gap-3 md:gap-4 py-5">
          {/* PC thumbnails (left side, vertical) */}
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

          {/* Image column: zoom (top) + image */}
          <div className="flex flex-col flex-1 min-h-0 justify-center  ">
            {/* Zoom controls - centered relative to image */}
            <div className="flex items-center justify-center mb-2 shrink-0">
              <div className="flex items-center gap-2 bg-black/60  rounded-full px-4 py-1.5">
                <button
                  onClick={zoomOut}
                  disabled={scale <= 1}
                  className="p-1.5 rounded-full text-white hover:bg-white/20  transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Alejar"
                >
                  <Minus className="w-5 h-5 md:w-4 md:h-4" strokeWidth={3} />
                </button>
                <span className="text-white text-sm md:text-xs font-semibold min-w-12 md:min-w-10 text-center tabular-nums">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  disabled={scale >= 5}
                  className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Acercar"
                >
                  <Plus className="w-5 h-5 md:w-4 md:h-4" strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Image container */}
            <div
              ref={containerRef}
              className="relative sm:flex-1 flex items-center justify-center overflow-hidden touch-none"
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
                src={`${server_url}/${currentImage}`}
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

        {/* Mobile thumbnails (bottom) */}
        {images.length > 1 && (
          <div className="md:hidden flex gap-3 justify-center pb-4 shrink-0">
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
