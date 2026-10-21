import { ImageResponse } from "next/og";

export const alt = "Monika Luxe — Interiors & Construction, Thanjavur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#06122a",
        color: "#f7f8fa",
        padding: 72,
      }}
    >
      <div style={{ display: "flex", fontSize: 22, letterSpacing: 8, color: "#c9a24d" }}>
        INTERIORS &amp; CONSTRUCTION · THANJAVUR
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 112, letterSpacing: 18, lineHeight: 1 }}>MONIKA LUXE</div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 40, color: "#e2c88f" }}>Your Vision. Our Craft.</div>
      </div>
      <div style={{ display: "flex", height: 2, width: 360, background: "#c9a24d" }} />
    </div>,
    size,
  );
}
