import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo/metadata";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #0B0620 0%, #140B2A 40%, #0B0620 100%)",
          color: "#F5F3FF",
        }}
      >
        <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.1 }}>{siteConfig.name}</div>
        <div style={{ marginTop: 20, fontSize: 32, fontWeight: 500, color: "#C4B5FD" }}>
          ИИ‑боты • сайты • MiniApps • n8n‑автоматизации
        </div>
        <div style={{ marginTop: 32, fontSize: 24, color: "#E9D5FF" }}>
          Запуск за 48–72 часа или MVP за 3–7 дней
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
