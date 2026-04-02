import { useMemo, useState } from "react";
import { ArrowRightLeft, Ruler, Shirt, CircleHelp } from "lucide-react";
import AboutHeroArtwork from "../../components/store/AboutHeroArtwork";

const tshirtData = {
  label: "T-Shirts",
  sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  measurements: [
    { label: "Length H.P.S", values: ["25¾", "26½", "27½", "28½", "29", "30", "31"] },
    { label: "Chest", values: ["20", "21", "22", "23", "24", "25", "26"] },
  ],
};

const hoodieData = {
  label: "Hoodies",
  sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  measurements: [
    { label: "Length", values: ["26", "27", "28", "29", "30", "31", "32"] },
    { label: "Chest", values: ["22", "23", "24", "25", "26", "27", "28"] },
  ],
};

const FRACTIONS = {
  "¼": 0.25,
  "½": 0.5,
  "¾": 0.75,
};

function parseMeasurement(value) {
  const raw = String(value).trim();
  const numeric = parseFloat(raw.replace(/[^\d.]/g, ""));
  const base = Number.isNaN(numeric) ? 0 : numeric;

  let fractionValue = 0;
  for (const [fractionChar, fractionNumber] of Object.entries(FRACTIONS)) {
    if (raw.includes(fractionChar)) {
      fractionValue += fractionNumber;
    }
  }

  return base + fractionValue;
}

const TShirtSVG = () => (
  <svg viewBox="0 0 280 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 240 }}>
    <path d="M55 58 L25 118 L70 132 L70 268 L210 268 L210 132 L255 118 L225 58 L188 76 Q140 96 92 76 Z" fill="#1e1e2e" stroke="#2a2a3e" strokeWidth="1.5" />
    <path d="M55 58 L25 118 L70 132 L92 76 Z" fill="#15152a" stroke="#2a2a3e" strokeWidth="1.5" />
    <path d="M225 58 L255 118 L210 132 L188 76 Z" fill="#15152a" stroke="#2a2a3e" strokeWidth="1.5" />
    <path d="M92 76 Q140 102 188 76" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <line x1="80" y1="170" x2="200" y2="170" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5 3" />
    <polygon points="77,167 77,173 70,170" fill="#3b82f6" />
    <polygon points="203,167 203,173 210,170" fill="#3b82f6" />
    <text x="140" y="162" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="700" fontFamily="DM Sans, sans-serif">CHEST</text>
    <line x1="150" y1="88" x2="150" y2="258" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" />
    <polygon points="147,85 153,85 150,78" fill="#f59e0b" />
    <polygon points="147,261 153,261 150,268" fill="#f59e0b" />
    <text x="165" y="185" fill="#f59e0b" fontSize="10" fontWeight="700" fontFamily="DM Sans, sans-serif" transform="rotate(90,165,185)">LENGTH H.P.S</text>
  </svg>
);

const HoodieSVG = () => (
  <svg viewBox="0 0 300 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 240 }}>
    <path d="M72 122 L72 288 L228 288 L228 122 Z" fill="#1e1e2e" stroke="#2a2a3e" strokeWidth="1.5" />
    <path d="M72 122 L28 134 L28 252 L72 252 Z" fill="#15152a" stroke="#2a2a3e" strokeWidth="1.5" />
    <path d="M228 122 L272 134 L272 252 L228 252 Z" fill="#15152a" stroke="#2a2a3e" strokeWidth="1.5" />
    <rect x="26" y="248" width="46" height="11" rx="3" fill="#0f0f1e" stroke="#2a2a3e" strokeWidth="1.2" />
    <rect x="228" y="248" width="46" height="11" rx="3" fill="#0f0f1e" stroke="#2a2a3e" strokeWidth="1.2" />
    <rect x="70" y="284" width="160" height="11" rx="3" fill="#0f0f1e" stroke="#2a2a3e" strokeWidth="1.2" />
    <path d="M96 76 Q88 38 150 28 Q212 38 204 76" fill="#15152a" stroke="#2a2a3e" strokeWidth="1.5" />
    <path d="M104 78 Q98 52 150 44 Q202 52 196 78" fill="#0f0f1e" stroke="#2a2a3e" strokeWidth="1.2" />
    <line x1="138" y1="78" x2="133" y2="205" stroke="#2a2a3e" strokeWidth="1.2" />
    <line x1="162" y1="78" x2="167" y2="205" stroke="#2a2a3e" strokeWidth="1.2" />
    <path d="M102 210 Q102 205 110 205 L190 205 Q198 205 198 210 L198 278 L102 278 Z" fill="#15152a" stroke="#2a2a3e" strokeWidth="1.2" />
    <line x1="82" y1="162" x2="218" y2="162" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5 3" />
    <polygon points="79,159 79,165 72,162" fill="#3b82f6" />
    <polygon points="221,159 221,165 228,162" fill="#3b82f6" />
    <text x="150" y="154" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="700" fontFamily="DM Sans, sans-serif">CHEST</text>
    <line x1="244" y1="76" x2="244" y2="288" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" />
    <polygon points="241,73 247,73 244,66" fill="#f59e0b" />
    <polygon points="241,291 247,291 244,298" fill="#f59e0b" />
    <text x="257" y="200" fill="#f59e0b" fontSize="10" fontWeight="700" fontFamily="DM Sans, sans-serif" transform="rotate(90,257,200)">LENGTH</text>
  </svg>
);

export default function SizeGuide() {
  const [activeTab, setActiveTab] = useState("tshirt");
  const [hoveredCol, setHoveredCol] = useState(null);
  const [unit, setUnit] = useState("in");

  const data = useMemo(
    () => (activeTab === "tshirt" ? tshirtData : hoodieData),
    [activeTab],
  );

  const displayValue = (value) => {
    if (unit === "cm") {
      return (parseMeasurement(value) * 2.54).toFixed(1);
    }
    return value;
  };

  return (
    <div className="bg-[#f5f5f8] text-[#1a1a2e] min-h-screen">
      <section className="relative overflow-hidden bg-[#2a0a4a] px-6 py-14 md:px-10 md:py-16">
        <div className="absolute inset-0">
          <AboutHeroArtwork />
        </div>
        <div className="absolute inset-0 bg-[#22083d]/45" />

        <div className="max-w-6xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/35 bg-blue-500/15 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
            Find Your Perfect Fit
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-6xl">
            Size <span className="text-blue-400">Guide</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#8888aa] md:text-base">
            All measurements are taken flat. Chest is measured as half chest. Double the value for full circumference.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 md:px-6 md:py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-xl border border-[#e0e0ea] bg-white p-1">
            <button
              type="button"
              onClick={() => setActiveTab("tshirt")}
              className={`rounded-lg px-6 py-2 text-sm font-semibold transition ${
                activeTab === "tshirt"
                  ? "bg-blue-500 text-white shadow"
                  : "text-[#9999aa] hover:bg-blue-50 hover:text-blue-500"
              }`}
            >
              T-Shirts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hoodie")}
              className={`rounded-lg px-6 py-2 text-sm font-semibold transition ${
                activeTab === "hoodie"
                  ? "bg-blue-500 text-white shadow"
                  : "text-[#9999aa] hover:bg-blue-50 hover:text-blue-500"
              }`}
            >
              Hoodies
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#aaaabc]">Unit:</span>
            <button
              type="button"
              onClick={() => setUnit("in")}
              className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
                unit === "in"
                  ? "border-blue-500 bg-blue-50 text-blue-500"
                  : "border-[#e0e0ea] bg-white text-[#9999aa]"
              }`}
            >
              Inches
            </button>
            <button
              type="button"
              onClick={() => setUnit("cm")}
              className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
                unit === "cm"
                  ? "border-blue-500 bg-blue-50 text-blue-500"
                  : "border-[#e0e0ea] bg-white text-[#9999aa]"
              }`}
            >
              CM
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-[#e8e8ee] bg-white p-6 text-center shadow-sm">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#8f8f9f]">Measurement Points - T-Shirt</p>
              <div className="flex justify-center"><TShirtSVG /></div>
              <div className="mt-5 flex flex-wrap justify-center gap-6 text-sm font-semibold text-[#2f3850]">
                <div className="flex items-center gap-2"><span className="h-0.5 w-8 rounded bg-blue-500" />Chest</div>
                <div className="flex items-center gap-2"><span className="h-0.5 w-8 rounded bg-amber-500" />Length</div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#e8e8ee] bg-white p-6 text-center shadow-sm">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#8f8f9f]">Measurement Points - Hoodie</p>
              <div className="flex justify-center"><HoodieSVG /></div>
              <div className="mt-5 flex flex-wrap justify-center gap-6 text-sm font-semibold text-[#2f3850]">
                <div className="flex items-center gap-2"><span className="h-0.5 w-8 rounded bg-blue-500" />Chest</div>
                <div className="flex items-center gap-2"><span className="h-0.5 w-8 rounded bg-amber-500" />Length</div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#e8e8ee] bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#f0f0f6] bg-[#fffbf0] px-5 py-3">
              <span className="text-sm">⚠️</span>
              <p className="text-xs font-bold uppercase tracking-[0.07em] text-amber-600">
                All measurements in {unit === "in" ? "inches (in)" : "centimeters (cm)"}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#eeeef5]">
                    <th className="bg-[#fafafa] px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.1em] text-[#555570]">Measurement</th>
                    {data.sizes.map((size, index) => (
                      <th
                        key={size}
                        className={`min-w-14 cursor-default px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.1em] ${
                          hoveredCol === index ? "bg-blue-50 text-blue-500" : "bg-[#fafafa] text-[#9999aa]"
                        }`}
                        onMouseEnter={() => setHoveredCol(index)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        {size}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.measurements.map((row, rowIndex) => (
                    <tr key={row.label} className={rowIndex % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                      <td className="px-4 py-3 text-left text-sm font-semibold text-[#555570]">{row.label}</td>
                      {row.values.map((value, colIndex) => (
                        <td
                          key={`${row.label}-${value}`}
                          className={`cursor-default px-4 py-3 text-center text-base font-bold ${
                            hoveredCol === colIndex ? "bg-blue-50 text-blue-500" : "text-[#1a1a2e]"
                          }`}
                          onMouseEnter={() => setHoveredCol(colIndex)}
                          onMouseLeave={() => setHoveredCol(null)}
                        >
                          {displayValue(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-[#f0f0f6] bg-[#fafafa] px-5 py-3 text-xs text-[#aaaabc]">
              Hover any size column to highlight measurements across all rows.
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1a1a2e]">How To <span className="text-[#4FA8FF]">Measure</span></h2>
          <p className="mt-2 text-sm text-[#8888a0]">Use a flexible measuring tape. Keep it snug, not tight.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shirt,
                title: "Chest",
                desc: "Wrap the tape around the fullest part of your chest, just under your arms. Keep it level all around.",
              },
              {
                icon: Ruler,
                title: "Length H.P.S",
                desc: "Measure from the highest point of your shoulder straight down to the bottom hem.",
              },
              {
                icon: ArrowRightLeft,
                title: "Between Sizes?",
                desc: "Choose one size up for relaxed fit. Size down only for a tighter fit.",
              },
              {
                icon: CircleHelp,
                title: "Need Help?",
                desc: "DM us on Instagram @wavoclothing.store and we will help pick your best fit.",
              },
            ].map((tip) => (
              <article key={tip.title} className="rounded-2xl border border-[#e8e8ee] bg-white p-5 shadow-sm transition hover:border-blue-500/40 hover:shadow">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <tip.icon size={20} strokeWidth={2.2} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[#1a1a2e]">{tip.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#8888a0]">{tip.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-5">
            <p className="text-sm font-bold text-blue-900">Important Note</p>
            <p className="mt-1 text-sm leading-6 text-blue-600">
              Measurements are garment measurements taken flat, not body measurements. Double chest values for full circumference.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
