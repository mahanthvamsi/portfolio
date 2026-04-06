"use client";

import { cn } from "@/utils/cn";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useScroll,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface NavItem {
  name: string;
  link: string;
  icon?: JSX.Element;
}

// ── Hamburger icon (3 lines, animates to X) ───────────────────────────────────
const HamburgerIcon = ({ open }: { open: boolean }) => (
  <div className="flex flex-col justify-center items-center w-5 h-5 gap-[5px]">
    <motion.span
      animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="block h-[1.5px] w-5 bg-white/80 origin-center"
    />
    <motion.span
      animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.2 }}
      className="block h-[1.5px] w-5 bg-white/80"
    />
    <motion.span
      animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="block h-[1.5px] w-5 bg-white/80 origin-center"
    />
  </div>
);

// ── Main export ───────────────────────────────────────────────────────────────
export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: NavItem[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        setVisible(direction < 0);
      }
    }
  });

  const dockItems = navItems.map((item) => ({
    title: item.name,
    href: item.link,
  }));

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn("fixed z-[5000] top-10 inset-x-0 mx-auto w-fit", className)}
      >
        <FloatingDock items={dockItems} />
      </motion.div>
    </AnimatePresence>
  );
};

// ── FloatingDock ──────────────────────────────────────────────────────────────
const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => (
  <>
    <FloatingDockDesktop items={items} className={desktopClassName} />
    <FloatingDockMobile items={items} className={mobileClassName} />
  </>
);

// ── Mobile: fixed top-right corner, dropdown ─────────────────────────────────
const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; href: string }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    // Fixed to top-right corner, independent of parent centering
    <div className={cn("fixed top-8 right-6 z-[5001] block md:hidden", className)}>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          backdropFilter: "blur(16px) saturate(180%)",
          backgroundColor: "rgba(17, 25, 40, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.125)",
        }}
      >
        <HamburgerIcon open={open} />
      </button>

      {/* Dropdown - opens DOWNWARD from the button */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop to close on outside click */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[-1]"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-12 right-0 flex flex-col gap-1 min-w-[160px] p-2 rounded-xl"
              style={{
                backdropFilter: "blur(20px) saturate(180%)",
                backgroundColor: "rgba(17, 25, 40, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.125)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              }}
            >
              {items.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-light text-white/70 hover:text-white transition-all duration-150"
                    style={{}}
                  >
                    {/* purple dot indicator */}
                    <span
                      className="mr-3 h-1 w-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    />
                    {item.title}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Desktop ───────────────────────────────────────────────────────────────────
const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; href: string }[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden md:flex h-14 items-end gap-1 rounded-xl px-4 pb-2",
        className
      )}
      style={{
        backdropFilter: "blur(16px) saturate(180%)",
        backgroundColor: "rgba(17, 25, 40, 0.75)",
        border: "1px solid rgba(255, 255, 255, 0.125)",
        boxShadow:
          "0px 2px 3px -1px rgba(0,0,0,0.1), 0px 0px 0px 1px rgba(25,28,33,0.08)",
      }}
    >
      {items.map((item) => (
        <TextContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

// ── Text item with strong dock-style magnification ────────────────────────────
function TextContainer({
  mouseX,
  title,
  href,
}: {
  mouseX: MotionValue;
  title: string;
  href: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Font: 16px base → 28px at cursor (bigger jump than before)
  const fontSizeTransform = useTransform(distance, [-140, 0, 140], [16, 28, 16]);
  const fontSize = useSpring(fontSizeTransform, {
    mass: 0.08,
    stiffness: 200,
    damping: 10,
  });

  // Lift: 0 → -10px (more dramatic)
  const yTransform = useTransform(distance, [-140, 0, 140], [0, -10, 0]);
  const y = useSpring(yTransform, { mass: 0.08, stiffness: 200, damping: 10 });

  // Opacity: dim neighbours, bright on hover
  const opacityTransform = useTransform(distance, [-140, 0, 140], [0.5, 1, 0.5]);
  const opacity = useSpring(opacityTransform, { mass: 0.1, stiffness: 200, damping: 12 });

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        style={{ y }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex items-center justify-center px-3 py-1.5 rounded-lg cursor-pointer"
      >
        {/* Glow pill on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.span
              layoutId="nav-hover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(102,126,234,0.2) 0%, rgba(118,75,162,0.2) 100%)",
                border: "1px solid rgba(102,126,234,0.35)",
                boxShadow: "0 0 12px rgba(102,126,234,0.2)",
              }}
            />
          )}
        </AnimatePresence>

        <motion.span
          className="relative z-10 font-light tracking-wide whitespace-nowrap transition-colors duration-150"
          style={
            {
              fontSize,
              opacity,
              color: hovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.6)",
              fontWeight: hovered ? 400 : 300,
              textShadow: hovered
                ? "0 0 20px rgba(167,139,250,0.6)"
                : "none",
              transition: "color 0.15s ease, text-shadow 0.15s ease, font-weight 0.15s ease",
            } as any
          }
        >
          {title}
        </motion.span>
      </motion.div>
    </Link>
  );
}