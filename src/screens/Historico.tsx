import { useState } from "react";
import { fmt } from "../lib/rates";

type Range = "7D" | "1M" | "3M";

// Series de muestra por rango (Fase 2: histórico real). [Cúcuta, TRM]
const DATA: Record<Range, { cucuta: number[]; trm: number[]; labels: string[] }> = {
  "7D": {
    cucuta: [4090, 4098, 4105, 4102, 4118, 4121, 4125],
    trm: [3905, 3910, 3908, 3915, 3918, 3919, 3920],
    labels: ["L", "M", "M", "J", "V", "S", "D"],
  },
  "1M": {
    cucuta: [3980, 4010, 4005, 4030, 4060, 4055, 4090, 4110, 4125],
    trm: [3850, 3865, 3870, 3880, 3895, 3900, 3910, 3915, 3920],
    labels: ["S1", "", "S2", "", "S3", "", "S4", "", "Hoy"],
  },
  "3M": {
    cucuta: [3720, 3800, 3760, 3850, 3900, 3880, 3960, 4040, 4125],
    trm: [3650, 3700, 3690, 3740, 3780, 3800, 3850, 3890, 3920],
    labels: ["May", "", "Jun", "", "Jul", "", "Ago", "", "Hoy"],
  },
};

function path(vals: number[], min: number, max: number, w: number, h: number) {
  const n = vals.length;
  const span = max - min || 1;
  return vals
    .map((v, i) => {
      const x = (i / (n - 1)) * w;
      const y = h - ((v - min) / span) * (h - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function Historico() {
  const [range, setRange] = useState<Range>("7D");
  const d = DATA[range];
  const all = [...d.cucuta, ...d.trm];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const W = 320;
  const H = 150;

  return (
    <div className="screen">
      <header className="screen__head">
        <h1 className="screen__title">Histórico</h1>
        <p className="screen__sub">Dólar Cúcuta vs. TRM oficial (COP)</p>
      </header>

      <div className="range">
        {(["7D", "1M", "3M"] as Range[]).map((r) => (
          <button
            key={r}
            className={r === range ? "range__b is-on" : "range__b"}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="chart">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="chart__svg">
          <polyline points={path(d.trm, min, max, W, H)} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <polyline points={path(d.cucuta, min, max, W, H)} fill="none" stroke="#E2C144" strokeWidth="3" />
        </svg>
        <div className="chart__x">
          {d.labels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      </div>

      <div className="legend">
        <span className="legend__i">
          <i className="dot dot--gold" /> Dólar Cúcuta · {fmt(d.cucuta[d.cucuta.length - 1])}
        </span>
        <span className="legend__i">
          <i className="dot dot--white" /> TRM oficial · {fmt(d.trm[d.trm.length - 1])}
        </span>
      </div>

      <p className="note">Datos de muestra — en vivo próximamente.</p>
    </div>
  );
}
