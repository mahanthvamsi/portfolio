"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  return isMounted;
}

// Tooltip width constant - used for viewport edge detection
const TOOLTIP_W = 260;
const TOOLTIP_OFFSET = 14;

export const Tooltip = ({
  content,
  children,
  containerClassName,
}: {
  content: string | React.ReactNode;
  children: React.ReactNode;
  containerClassName?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Guard: prevents the global tap-outside listener from firing on the very
  // tap that opened the tooltip
  const justOpenedRef = useRef(false);
  const isMounted = useIsMounted();

  // ── Smart position: prefer right of cursor, flip left if near right edge ──
  const calcPos = useCallback((clientX: number, clientY: number) => {
    const tooltipH = contentRef.current?.scrollHeight ?? 150;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Default: right + below cursor
    let x = clientX + TOOLTIP_OFFSET;
    let y = clientY + TOOLTIP_OFFSET;

    // Flip left if would overflow right edge
    if (x + TOOLTIP_W > vw - 8) {
      x = clientX - TOOLTIP_W - TOOLTIP_OFFSET;
    }
    // Clamp left edge
    if (x < 8) x = 8;

    // Flip above if would overflow bottom
    if (y + tooltipH > vh - 8) {
      y = clientY - tooltipH - TOOLTIP_OFFSET;
    }
    // Clamp top edge
    if (y < 8) y = 8;

    return { x, y };
  }, []);

  // ── Desktop mouse handlers ─────────────────────────────────────────────────
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setPos(calcPos(e.clientX, e.clientY));
    setIsVisible(true);
  };

  const handleMouseLeave = () => setIsVisible(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isVisible) return;
    setPos(calcPos(e.clientX, e.clientY));
  };

  // ── Touch / mobile handlers ────────────────────────────────────────────────
  // Tap the trigger → show tooltip and keep it until tap outside
  const touchStartYRef = useRef(0);
  const touchMovedRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0].clientY;
    touchMovedRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (Math.abs(e.touches[0].clientY - touchStartYRef.current) > 8) {
      touchMovedRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchMovedRef.current) return; // was a scroll, not a tap

    e.stopPropagation();

    if (isVisible) {
      // Second tap on the trigger closes it
      setIsVisible(false);
      return;
    }

    const touch = e.changedTouches[0];
    setPos(calcPos(touch.clientX, touch.clientY));

    // Flag so the global listener below doesn't immediately close it
    justOpenedRef.current = true;
    setIsVisible(true);
    setTimeout(() => { justOpenedRef.current = false; }, 350);
  };

  // ── Global tap-outside to close (mobile) ───────────────────────────────────
  // Uses touchend so it fires after handleTouchEnd above, with justOpenedRef guard
  useEffect(() => {
    if (!isVisible) return;

    const dismiss = (e: TouchEvent) => {
      if (justOpenedRef.current) return;
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    // passive:true so we don't block scrolling
    document.addEventListener("touchend", dismiss, { passive: true });
    return () => document.removeEventListener("touchend", dismiss);
  }, [isVisible]);

  // Portal target - only available client-side
  const portalRoot = isMounted ? document.body : null;

  const tooltipEl = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="tooltip"
          initial={{ opacity: 0, scale: 0.95, y: -4 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{    opacity: 0, scale: 0.95, y: -4  }}
          transition={{ duration: 0.14, ease: "easeOut" }}
          className="pointer-events-none fixed z-[9999]"
          style={{
            top:  pos.y,
            left: pos.x,
            width: TOOLTIP_W,
            // Solid - portalled to body so no parent clips or bleeds through
            backgroundColor: "#0c0c14",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "12px",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03), 0 16px 48px rgba(0,0,0,0.95), 0 4px 12px rgba(0,0,0,0.98)",
          }}
        >
          <div ref={contentRef} className="p-3.5">
            {content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block", containerClassName)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
      {/* Portal renders outside all card DOM trees - no clipping, no bleed */}
      {portalRoot && createPortal(tooltipEl, portalRoot)}
    </div>
  );
};