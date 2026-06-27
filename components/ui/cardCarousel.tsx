"use client";

import { ReactNode, useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Extender Window para el flag global del modal
declare global {
  interface Window {
    __modalOpen?: boolean;
  }
}

interface CardCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  speed?: number; // duration in seconds for one full loop
  gap?: number; // gap in rem
  pauseOnHover?: boolean;
  direction?: "left" | "right";
}

export default function CardCarousel<T>({
  items,
  renderItem,
  speed = 150,
  gap = 1,
  pauseOnHover = true,
  direction = "left",
}: CardCarouselProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  if (!items || items.length === 0) return null;

  // Duplicate items more times for a larger "safe zone" for smooth scrolling
  const duplicatedItems = [...items, ...items, ...items, ...items, ...items, ...items];

  // Initial scroll position to the middle (Set 3)
  useEffect(() => {
    if (containerRef.current) {
      const oneSetWidth = containerRef.current.scrollWidth / 6;
      containerRef.current.scrollLeft = oneSetWidth * 2;
    }
  }, [items.length]);

  // Handle screen size changes (xl breakpoint is 1280px)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1280);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);


  // Clean up timer on unmount + check if mouse is already hovering on mount
  useEffect(() => {
    // Verificar si el mouse ya está sobre el carrusel después del primer paint
    const rafId = requestAnimationFrame(() => {
      if (containerRef.current?.matches(':hover')) {
        setIsPaused(true);
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isPaused) return;

    let animationFrameId: number;

    // Calculate scroll speed
    const baseIncrement = Math.min(container.offsetWidth, 1920) / (speed * 10);
    const scrollSpeed = Math.max(0.1, baseIncrement);

    const animate = () => {
      // Pausar si el modal está abierto (flag global)
      if (window.__modalOpen) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      if (container) {
        if (direction === "left") {
          container.scrollLeft += scrollSpeed;
        } else {
          container.scrollLeft -= scrollSpeed;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, speed, direction]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const oneSetWidth = container.scrollWidth / 6;
    if (oneSetWidth === 0) return;

    // Mantenemos el scroll en el rango central (Sets 3 y 4)
    // Esto da mucho más espacio para que los scrolls suaves de las flechas no se traben
    if (container.scrollLeft < oneSetWidth * 1.5) {
      container.scrollLeft += oneSetWidth;
    } else if (container.scrollLeft >= oneSetWidth * 3.5) {
      container.scrollLeft -= oneSetWidth;
    }
  };

  const handleInteraction = () => {
    // If it's a large screen (xl+), we don't apply the 20s pause logic
    if (isLargeScreen) return;

    // Stop any existing timer
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    
    // Pause the carousel
    setIsPaused(true);
    
    // Set timer to resume after 20 seconds
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
      pauseTimerRef.current = null;
    }, 20000); // 20 seconds
  };

  const scrollAnimationRef = useRef<number | null>(null);

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    // Pausamos la animación automática
    setIsPaused(true);

    // Si ya hay una animación en curso, la cancelamos para que no se trabe
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
    }

    const scrollAmount = 300;
    const startPos = container.scrollLeft;
    const targetPos = direction === "left" ? startPos - scrollAmount : startPos + scrollAmount;
    const duration = 400; // milisegundos
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Función de suavizado (easeOutQuad)
      const ease = (t: number) => t * (2 - t);
      
      if (container) {
        container.scrollLeft = startPos + (targetPos - startPos) * ease(progress);
      }

      if (elapsed < duration) {
        scrollAnimationRef.current = requestAnimationFrame(animate);
      } else {
        scrollAnimationRef.current = null;
      }
    };

    scrollAnimationRef.current = requestAnimationFrame(animate);
  };

  return (
    <div
      className="w-full relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (!pauseTimerRef.current) {
          setIsPaused(false);
        }
      }}
    >
      {/* Flechas Lucide */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          scroll("left");
        }}
        onMouseEnter={() => setIsPaused(true)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2  bg-black/50 hover:bg-black/70  rounded-full hidden xl:group-hover:flex items-center justify-center shadow-md transition-all  cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 text-white" strokeWidth={4} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          scroll("right");
        }}
        onMouseEnter={() => setIsPaused(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full hidden xl:group-hover:flex items-center justify-center shadow-md transition-all cursor-pointer"
      >
        <ChevronRight className="w-6 h-6 text-white" strokeWidth={4} />
      </button>

      <div
        ref={containerRef}
        className="flex items-center overflow-x-auto scrollbar-hide select-none py-2 "
        style={{ gap: `${gap}rem` }}
        onScroll={handleScroll}
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
      >
        {duplicatedItems.map((item, index) => (
          <div key={index} className="shrink-0 w-55">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
