import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lumen — Design Studio & Store";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #0c0c14 0%, #1a1030 55%, #2a1840 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
          Lumen<span style={{ color: "#f59e42" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
            We build brands and the products that carry them.
          </div>
          <div style={{ fontSize: 32, color: "#b8b3c7" }}>
            Design & engineering studio · Curated store
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 26,
            color: "#9b95ad",
          }}
        >
          Portfolio · Services · Shop · Journal
        </div>
      </div>
    ),
    size
  );
}
