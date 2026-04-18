import { useState } from "react";
import hoodieImage from "../../assets/hoody-size.png";
import tshirtImage from "../../assets/tshirt-size.png";

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
  const [tab, setTab] = useState("tshirt"); // tshirt first
  const [unit, setUnit] = useState("in");

  const tableData = data[tab];
  const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2a1250] to-[#1a0a2e] flex flex-col items-center px-4 py-16">

      {/* HERO */}
      <div className="text-center max-w-3xl mb-12">
        <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-wide">
          SIZE <span className="text-purple-400">Guide</span>
        </h1>
        <p className="text-gray-300 mt-4 text-lg">
          Find your perfect fit with precision-crafted measurements.
        </p>
      </div>

      {/* CARD */}
      <div className="w-full max-w-6xl rounded-3xl overflow-hidden 
        bg-white/95 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.4)] border border-white/10">

        {/* TABS */}
        <div className="flex bg-gradient-to-r from-purple-50 to-purple-100">
          {["tshirt", "hoodie"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-5 text-sm font-semibold uppercase tracking-wide transition-all duration-300
              ${
                tab === t
                  ? "bg-white text-purple-600 shadow-inner border-b-4 border-purple-600"
                  : "text-gray-400 hover:text-purple-500"
              }`}
            >
              {t === "hoodie" ? "Hoodie" : "T-Shirt"}
            </button>
          ))}
        </div>

        {/* UNIT SWITCH */}
        <div className="flex justify-between items-center px-8 py-5 border-b bg-white">
          <span className="text-xs uppercase font-semibold text-gray-400 tracking-widest">
            Select Unit
          </span>

          <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
            {["in", "cm"].map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-5 py-2 text-sm rounded-lg font-semibold transition-all duration-300
                  ${
                    unit === u
                      ? "bg-yellow-500 text-white shadow-md"
                      : "text-gray-500 hover:text-black"
                  }
                `}
              >
                {u === "in" ? "INCHES" : "CM"}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col md:flex-row gap-10 p-6 md:p-10">

          {/* IMAGE PANEL (LEFT ✅) */}
          <div className="md:w-1/3 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-purple-500 font-semibold">
                Measurement Reference
              </p>
              <h2 className="text-2xl font-bold text-gray-800">
                {tab === "hoodie" ? "Hoodie" : "T-Shirt"} Guide
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                All measurements are in {unit === "in" ? "inches" : "centimeters"}.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 shadow-inner">
              <img
                src={tab === "hoodie" ? hoodieImage : tshirtImage}
                alt="measurement"
                className="w-full object-contain rounded-lg"
              />
            </div>
          </div>

          {/* TABLE PANEL (RIGHT ✅) */}
          <div className="md:w-2/3">

            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest text-yellow-500 font-semibold">
                Size Chart
              </p>
              <h3 className="text-xl font-bold text-gray-800">
                Measurement Table
              </h3>
            </div>

            <div className="overflow-x-auto rounded-xl border shadow-sm">
              <table className="w-full text-sm md:text-base">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Measurement
                    </th>
                    {sizes.map((sz) => (
                      <th key={sz} className="p-4 text-center font-semibold text-gray-700">
                        {sz}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {Object.entries(tableData).map(([label, vals], idx) => (
                    <tr
                      key={label}
                      className={`border-t ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="p-4 font-semibold text-gray-800">
                        {label}
                      </td>
                      {vals.map((v, i) => (
                        <td key={i} className="p-4 text-center text-gray-600">
                          {fmt(v, unit)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}