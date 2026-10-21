import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/lib/photos";
import styles from "./Marquee.module.css";

/** Two endless rows of photos drifting in opposite directions. */
export default function Marquee({ rows }: { rows: Photo[][] }) {
  return (
    <section className={styles.marquee} aria-label="Uit het archief">
      <div className={styles.head}>
        <span className="label">Uit het archief</span>
      </div>
      {rows.map((row, r) => (
        <div key={r} className={`${styles.row} ${r % 2 ? styles.reverse : ""}`}>
          <div className={styles.track}>
            {[...row, ...row].map((p, i) => (
              <Link
                key={`${p.key}-${i}`}
                href={`/${p.collection}#${p.id}`}
                className={styles.tile}
                style={{ aspectRatio: `${p.width} / ${p.height}` }}
                data-cursor="Open"
                tabIndex={i >= row.length ? -1 : undefined}
                aria-hidden={i >= row.length ? true : undefined}
              >
                <Image
                  src={p.src}
                  alt={p.title ?? ""}
                  fill
                  sizes="(max-width: 700px) 60vw, 30vw"
                  placeholder={p.blurDataURL ? "blur" : "empty"}
                  blurDataURL={p.blurDataURL}
                  style={{ objectFit: "cover" }}
                />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
