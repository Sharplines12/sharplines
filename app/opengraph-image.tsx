import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/data";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

function SharplinesMark() {
  return (
    <div
      style={{
        width: 132,
        height: 132,
        borderRadius: 36,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)"
      }}
    >
      <svg width="76" height="76" viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="og-mark-gradient" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ECF4FF" />
            <stop offset="1" stopColor="#B7FF4A" />
          </linearGradient>
        </defs>
        <path
          d="M24 4 40 12v12c0 10.6-7.4 16.8-15.2 19.6a2.2 2.2 0 0 1-1.6 0C15.4 40.8 8 34.6 8 24V12L24 4Z"
          stroke="url(#og-mark-gradient)"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M15 30.5h7.4l4.1-12 3 7h3.5"
          stroke="#B7FF4A"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at top right, rgba(55,211,255,0.18), transparent 32%), radial-gradient(circle at bottom left, rgba(183,255,74,0.16), transparent 28%), linear-gradient(135deg, #06111f 0%, #0b1727 52%, #0a1322 100%)",
          color: "white",
          padding: "56px"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(154,176,203,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(154,176,203,0.08) 1px, transparent 1px)",
            backgroundSize: "56px 56px"
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            width: "100%",
            height: "100%",
            borderRadius: 40,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(8, 18, 31, 0.76)",
            padding: "54px",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <SharplinesMark />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 12,
                  fontSize: 66,
                  lineHeight: 1,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 700
                }}
              >
                <span style={{ color: "#F8FBFF" }}>Sharp</span>
                <span style={{ color: "#B7FF4A" }}>Lines</span>
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 18,
                  textTransform: "uppercase",
                  letterSpacing: "0.32em",
                  color: "rgba(201,214,230,0.72)"
                }}
              >
                Betting media + premium card
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 860 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                alignSelf: "flex-start",
                borderRadius: 999,
                border: "1px solid rgba(183,255,74,0.25)",
                background: "rgba(183,255,74,0.08)",
                padding: "12px 18px",
                color: "#B7FF4A",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase"
              }}
            >
              Daily top picks
            </div>
            <div
              style={{
                fontSize: 64,
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                fontWeight: 700
              }}
            >
              Premium picks, sportsbook reviews, and clean betting analysis.
            </div>
            <div
              style={{
                fontSize: 24,
                lineHeight: 1.5,
                color: "rgba(214,225,236,0.8)",
                maxWidth: 920
              }}
            >
              {siteConfig.tagline}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                display: "flex",
                gap: 16,
                color: "rgba(214,225,236,0.72)",
                fontSize: 18,
                textTransform: "uppercase",
                letterSpacing: "0.18em"
              }}
            >
              <span>Daily card</span>
              <span>Premium analysis</span>
              <span>Sportsbook reviews</span>
            </div>
            <div
              style={{
                color: "#B7FF4A",
                fontSize: 18,
                textTransform: "uppercase",
                letterSpacing: "0.18em"
              }}
            >
              sharplines.us
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
