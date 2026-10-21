"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { lockScroll } from "./SmoothScroll";
import styles from "./Intro.module.css";

const ease = [0.76, 0, 0.24, 1] as const;

/** Opening curtain: a dark room with a line of light, shown once per browser session. */
export default function Intro({ preload }: { preload: string[] }) {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro") === "1";
      sessionStorage.setItem("intro", "1");
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }
    lockScroll(true);

    let loaded = 0;
    preload.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => loaded++;
      img.src = src;
    });

    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      // Time-driven count that waits at 95 until the first hero photos are in.
      const t = Math.min(1, (now - start) / 2200);
      const ready = loaded >= Math.min(2, preload.length) || now - start > 5000;
      setCount(Math.round((ready ? t : Math.min(t, 0.95)) * 100));
      if (t >= 1 && ready) done();
      else frame = requestAnimationFrame(tick);
    });
    function done() {
      setCount(100);
      setTimeout(() => {
        setShow(false);
        lockScroll(false);
      }, 350);
    }
    return () => {
      cancelAnimationFrame(frame);
      lockScroll(false);
    };
  }, [preload]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.intro}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1.1, ease }}
        >
          <div className={styles.bottom}>
            <span className={styles.count}>{String(count).padStart(3, "0")}</span>
          </div>
          <motion.div className={styles.line} style={{ scaleX: count / 100 }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
