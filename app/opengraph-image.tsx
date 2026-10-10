import { ImageResponse } from "next/og";
import { getSeo, seoStr } from "@/lib/seo";

export const alt = "CameraCraft — Marketing & Video Editing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated share card, used whenever no custom image is set in the admin.
 * Rendered at build time so social crawlers — which do not run JavaScript
 * and often do not wait around — always get a real image.
 */
export default async function OpengraphImage() {
  const { seo } = await getSeo();
  const siteName = seoStr(seo.siteName) || "CameraCraft";
  const title = seoStr(seo.title) || siteName;
  const description = seoStr(seo.description);

  // Drop a trailing "Brand — " prefix so the card is not just the brand twice.
  const headline = title.includes("—") ? title.split("—").slice(1).join("—").trim() : title;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#faf9f7",
          backgroundImage:
            "radial-gradient(900px 600px at 8% -10%, #ffd9c7 0%, #faf9f7 55%), radial-gradient(700px 500px at 100% 110%, #e2ddfd 0%, rgba(250,249,247,0) 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 20, height: 20, borderRadius: 999, background: "#e8400d" }} />
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -1, color: "#111111" }}>{siteName}</div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: headline.length > 48 ? 70 : 86,
            fontWeight: 800,
            lineHeight: 1.03,
            letterSpacing: -3.5,
            color: "#111111",
            maxWidth: 1000,
          }}
        >
          {headline}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40 }}>
          <div style={{ display: "flex", fontSize: 25, lineHeight: 1.35, color: "#4a4845", maxWidth: 760 }}>
            {description.length > 150 ? `${description.slice(0, 147)}…` : description}
          </div>
          <div
            style={{
              display: "flex",
              padding: "12px 22px",
              borderRadius: 999,
              background: "#111111",
              color: "#ffffff",
              fontSize: 21,
              whiteSpace: "nowrap",
            }}
          >
            Marketing × Motion
          </div>
        </div>
      </div>
    ),
    size,
  );
}
