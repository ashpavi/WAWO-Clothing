import { useState } from "react";
import hoodieImage from "../../assets/default-product.jpg";
import tshirtImage from "../../assets/default-product.jpg";

const data = {
  hoodie: {
    "Length H.P.S": [27, 28, 29, 30, 31, 32, 33],
    Chest: [21, 22, 23, 24.5, 26, 27.5, 29],
  },
  tshirt: {
    "Length H.P.S": [25.75, 26.5, 27.5, 28.5, 29, 30, 31],
    Chest: [20, 21, 22, 23, 24, 25, 26],
  },
};

function fmt(val, unit) {
  if (unit === "in") {
    const fmap = { 0.25: "1/4", 0.5: "1/2", 0.75: "3/4" };
    const whole = Math.floor(val);
    const frac = +(val - whole).toFixed(2);
    return frac ? `${whole} ${fmap[frac] || frac}` : `${whole}`;
  }
  return (val * 2.54).toFixed(1);
}

export default function SizeChart() {
  const [tab, setTab] = useState("hoodie");
  const [unit, setUnit] = useState("in");

  const unitLabel = unit === "in" ? "inches" : "centimeters";
  const tableData = data[tab];
  const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

  return (
    <div style={s.body}>
      {/* Wave BG */}
      <svg style={s.waves} viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice">
        <path d="M0,200 C200,100 400,300 600,200 C800,100 1000,300 1200,200" stroke="#7c3aed" strokeWidth="1.5" fill="none" opacity="0.3"/>
        <path d="M0,280 C200,180 400,370 600,270 C800,170 1000,360 1200,270" stroke="#7c3aed" strokeWidth="1" fill="none" opacity="0.2"/>
        <path d="M0,150 C200,60 400,240 600,150 C800,60 1000,240 1200,150" stroke="#9b59b6" strokeWidth="0.8" fill="none" opacity="0.15"/>
        <circle cx="100" cy="90" r="5" fill="none" stroke="#7c3aed" strokeWidth="1.5" opacity="0.5"/>
        <circle cx="1100" cy="70" r="5" fill="none" stroke="#7c3aed" strokeWidth="1.5" opacity="0.4"/>
      </svg>

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.brand}>
          SIZE <span style={{ color: "#7c3aed" }}>Guide</span>
        </div>
        <p style={s.subtitle}>
          Use the illustrations below to understand where chest and length are measured, then match your size using the chart.
        </p>
      </div>

      {/* Card */}
      <div style={s.card}>

        {/* Tabs */}
        <div style={s.tabs}>
          {["hoodie", "tshirt"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ ...s.tab, ...(tab === t ? s.tabOn : {}) }}>
              {t === "hoodie" ? "Hoodie" : "T-Shirt"}
            </button>
          ))}
        </div>

        {/* Unit row */}
        <div style={s.unitRow}>
          <span style={s.unitLbl}>Select Unit</span>
          <div style={s.toggle}>
            {["in", "cm"].map((u) => (
              <button key={u} onClick={() => setUnit(u)}
                style={{ ...s.tbtn, ...(unit === u ? s.tbtnOn : {}) }}>
                {u === "in" ? "INCHES" : "CM"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={s.panel}>
          <div style={s.inner}>

            {/* Diagram */}
            <div style={s.dCol}>
              <div style={s.dLbl}>{tab === "hoodie" ? "Hoodie" : "T-Shirt"} Measurement</div>
              <div style={s.dTitle}>{tab === "hoodie" ? "Hoodie" : "T-Shirt"} Size Chart</div>
              <div style={s.dSub}>All measurements in {unitLabel}.</div>
              <div style={s.dImgBox}>
                <img
                  src={tab === "hoodie" ? hoodieImage : tshirtImage}
                  alt={tab === "hoodie" ? "Hoodie measurement reference" : "T-shirt measurement reference"}
                  style={s.dImg}
                />
              </div>
            </div>

            {/* Table */}
            <div style={s.tCol}>
              <div style={s.tBox}>
                <div style={s.tHead}>
                  <div style={s.mpLbl}>Measurement Points</div>
                  <div style={s.mpSub}>Size chart in {unitLabel}</div>
                </div>
                <table style={s.table}>
                  <thead>
                    <tr style={{ background: "#f7f4fd" }}>
                      <th style={{ ...s.th, textAlign: "left" }}>Measurement</th>
                      {sizes.map((sz) => <th key={sz} style={s.th}>{sz}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(tableData).map(([label, vals]) => (
                      <tr key={label}>
                        <td style={{ ...s.td, textAlign: "left", color: "#1a0a2e", fontWeight: 600 }}>{label}</td>
                        {vals.map((v, i) => <td key={i} style={s.td}>{fmt(v, unit)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={s.tFoot}>All measurements in {unitLabel}.</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div style={s.footer}>www.wavoclothing.store</div>
    </div>
  );
}

const s = {
  body: { background: "#1a0a2e", backgroundImage: "radial-gradient(ellipse 80% 60% at 50% -10%, #3b1a6e 0%, transparent 70%)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 16px", fontFamily: "sans-serif", position: "relative" },
  waves: { position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 },
  hero: { width: "100%", maxWidth: 1040, marginBottom: 32, position: "relative", zIndex: 1 },
  brand: { fontFamily: "Impact, sans-serif", fontSize: 52, letterSpacing: 6, color: "#fff", lineHeight: 1 },
  subtitle: { fontSize: 15, color: "#a89dc0", marginTop: 8, lineHeight: 1.6, maxWidth: 620 },
  card: { background: "rgba(255,255,255,0.97)", borderRadius: 16, width: "100%", maxWidth: 1040, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.4)", position: "relative", zIndex: 1 },
  tabs: { display: "flex", background: "#f4f0ff", borderBottom: "1px solid #e0d8f0" },
  tab: { flex: 1, padding: "18px", background: "none", border: "none", borderBottom: "3px solid transparent", color: "#9980c0", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, cursor: "pointer", marginBottom: -1 },
  tabOn: { color: "#7c3aed", borderBottomColor: "#7c3aed", background: "#fff" },
  unitRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #ede8f8", background: "#fdfcff" },
  unitLbl: { fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#9980c0", fontWeight: 700 },
  toggle: { display: "flex", background: "#ede8f8", borderRadius: 8, padding: 4, gap: 4 },
  tbtn: { padding: "8px 18px", background: "none", border: "none", color: "#9980c0", fontSize: 13, fontWeight: 700, cursor: "pointer", borderRadius: 6 },
  tbtnOn: { background: "#f0a500", color: "#fff" },
  panel: { padding: "28px 28px 32px" },
  inner: { display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" },
  dCol: { flex: "0 0 280px", minWidth: 220 },
  dLbl: { fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#9980c0", fontWeight: 700, marginBottom: 8 },
  dTitle: { fontSize: 28, fontWeight: 700, color: "#1a0a2e", marginBottom: 4 },
  dSub: { fontSize: 14, color: "#9980c0", marginBottom: 14 },
  dImgBox: { background: "#ede8fa", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  dImg: { width: "100%", maxWidth: 300, height: "auto", borderRadius: 8, objectFit: "cover" },
  tCol: { flex: 1, minWidth: 380 },
  tBox: { border: "1px solid #e8e0f8", borderRadius: 12, overflow: "hidden" },
  tHead: { background: "#fef9ec", borderBottom: "1px solid #e8e0f8", padding: "14px 18px" },
  mpLbl: { fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#f0a500", fontWeight: 700, marginBottom: 4 },
  mpSub: { fontSize: 14, color: "#666" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 15 },
  th: { padding: "12px 10px", textAlign: "center", fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", color: "#1a0a2e", fontWeight: 700, borderBottom: "1px solid #e8e0f8" },
  td: { padding: "14px 10px", textAlign: "center", borderBottom: "1px solid #f0ecfa", color: "#444", fontSize: 15 },
  tFoot: { padding: "12px 18px", fontSize: 13, color: "#9980c0", borderTop: "1px solid #e8e0f8", background: "#fdfcff" },
  footer: { marginTop: 24, fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", position: "relative", zIndex: 1 },
};
