"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Custom cursor: a small dot that grows into a ring with a label when it
 * hovers anything carrying a data-cursor attribute.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const visible = useRef(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      visible.current = true;
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(el ? el.dataset.cursor ?? "" : null);
    };
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [x, y]);

  if (!enabled) return null;
  const active = label !== null;

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        left: sx,
        top: sy,
        zIndex: 100,
        pointerEvents: "none",
        translateX: "-50%",
        translateY: "-50%",
        mixBlendMode: active ? "normal" : "difference",
      }}
    >
      <motion.div
        animate={{
          width: active ? 92 : 10,
          height: active ? 92 : 10,
          backgroundColor: active ? "rgba(10,10,10,0.35)" : "rgba(255,255,255,1)",
          borderColor: active ? "rgba(236,232,225,0.7)" : "rgba(255,255,255,0)",
          scale: down ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        style={{
          borderRadius: "50%",
          border: "1px solid",
          display: "grid",
          placeItems: "center",
          backdropFilter: active ? "blur(6px)" : "none",
        }}
      >
        <motion.span
          animate={{ opacity: active && label ? 1 : 0 }}
          style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#ece8e1", paddingLeft: "0.24em" }}
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
