import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100svh", display: "grid", placeItems: "center", textAlign: "center", padding: "0 var(--gutter)" }}>
      <div>
        <p className="serif" style={{ fontSize: "clamp(64px, 12vw, 180px)", margin: 0, fontStyle: "italic" }}>
          Buiten beeld
        </p>
        <Link href="/" className="label" data-cursor="">
          Terug naar de expositie →
        </Link>
      </div>
    </main>
  );
}
