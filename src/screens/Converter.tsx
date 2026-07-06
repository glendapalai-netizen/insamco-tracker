import { useEffect, useMemo, useState } from "react";
import { ORDER, TRM_FALLBACK, buildCur, convert, fetchTrm, type Code } from "../lib/rates";

const nf = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Líneas de tendencia (muestra) — una moneda, un color CMYK.
const TREND: { label: string; color: string; pts: string }[] = [
  { label: "Peso", color: "#22D3EE", pts: "0,42 43,40 86,44 129,37 171,34 214,31 257,27 300,22" },
  { label: "Bolívar", color: "#F45DBE", pts: "0,47 43,45 86,41 129,43 171,37 214,34 257,31 300,27" },
  { label: "Dólar", color: "#E2C144", pts: "0,50 43,49 86,50 129,48 171,49 214,47 257,48 300,45" },
  { label: "USDT", color: "#E6EDF3", pts: "0,53 43,51 86,53 129,50 171,51 214,49 257,50 300,46" },
];

function group(raw: string): string {
  if (raw === "") return "";
  const [int, dec] = raw.split(",");
  const intGrouped = (int || "0").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec !== undefined ? `${intGrouped},${dec}` : intGrouped;
}
function toNumber(raw: string): number {
  return parseFloat(raw.replace(",", ".")) || 0;
}
function numToRaw(n: number): string {
  if (!Number.isFinite(n) || n === 0) return "";
  return String(Math.round(n * 100) / 100).replace(".", ",");
}
function sanitize(input: string): string {
  let s = input.replace(/\./g, "").replace(/[^\d,]/g, "");
  const i = s.indexOf(",");
  if (i !== -1) s = s.slice(0, i + 1) + s.slice(i + 1).replace(/,/g, "");
  const parts = s.split(",");
  return parts[1] !== undefined ? `${parts[0]},${parts[1].slice(0, 2)}` : parts[0];
}

export default function Converter() {
  const [trm, setTrm] = useState(TRM_FALLBACK);
  const [trmInfo, setTrmInfo] = useState<{ date: string; live: boolean }>({
    date: "2026-07-06",
    live: false,
  });

  const [from, setFrom] = useState<Code>("COP");
  const [to, setTo] = useState<Code>("VES");
  const [editField, setEditField] = useState<"from" | "to">("from");
  const [raw, setRaw] = useState("");
  const [copied, setCopied] = useState(false);

  // Jala el TRM oficial en vivo al abrir.
  useEffect(() => {
    let alive = true;
    fetchTrm().then((r) => {
      if (!alive) return;
      setTrm(r.trm);
      setTrmInfo({ date: r.date, live: r.live });
    });
    return () => {
      alive = false;
    };
  }, []);

  const cur = useMemo(() => buildCur(trm), [trm]);

  const value = toNumber(raw);
  const fromNum = editField === "from" ? value : convert(value, to, from, cur);
  const toNum = editField === "to" ? value : convert(value, from, to, cur);

  const fromDisplay = editField === "from" ? group(raw) : fromNum ? nf.format(fromNum) : "";
  const toDisplay = editField === "to" ? group(raw) : toNum ? nf.format(toNum) : "";

  const focusField = (field: "from" | "to", num: number) => {
    setEditField(field);
    setRaw(numToRaw(num));
    setCopied(false);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    setEditField((f) => (f === "from" ? "to" : "from"));
    setCopied(false);
  };

  const copy = async (num: number) => {
    try {
      await navigator.clipboard.writeText(num.toFixed(2));
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const rows = [
    { field: "from" as const, code: from, setCode: setFrom, display: fromDisplay, num: fromNum },
    { field: "to" as const, code: to, setCode: setTo, display: toDisplay, num: toNum },
  ];

  return (
    <>
      <header className="brand">
        <img className="brand__logo" src="/logo.png" alt="Grupo Insamco" />
        <div className="brand__name">GRUPO INSAMCO</div>
        <div className="brand__sub">Convertidor</div>
      </header>

      <section className="card">
        {rows.map((r) => (
          <div key={r.field} className={`row ${editField === r.field ? "row--active" : ""}`}>
            <select
              className="row__cur"
              value={r.code}
              onChange={(e) => r.setCode(e.target.value as Code)}
              aria-label="Moneda"
            >
              {ORDER.map((c) => (
                <option key={c} value={c}>
                  {cur[c].label}
                </option>
              ))}
            </select>
            <input
              className="row__val"
              type="text"
              inputMode="decimal"
              value={r.display}
              placeholder="0"
              aria-label="Monto"
              onFocus={() => focusField(r.field, r.num)}
              onChange={(e) => {
                setEditField(r.field);
                setRaw(sanitize(e.target.value));
                setCopied(false);
              }}
            />
            <button className="copy" onClick={() => copy(r.num)} aria-label="Copiar" title="Copiar">
              ⧉
            </button>
          </div>
        ))}
        <button className="swap" onClick={swap} aria-label="Intercambiar monedas">
          ⇅
        </button>
      </section>

      <div className="ref">
        <span>
          <span className="ref__star">★ Dólar Cúcuta</span> {nf.format(cur.USD.cop)} · USDT {nf.format(cur.USDT.cop)} COP
        </span>
        <span className="ref__trm">
          {trmInfo.live ? "🟢 en vivo · " : ""}TRM oficial {nf.format(trm)} (banrep {trmInfo.date})
        </span>
      </div>

      <p className="tip">Toca cualquier cifra para escribirla · Toca ⧉ para copiar y pegar en tu banco</p>

      <div className="trend">
        <svg className="trend__svg" viewBox="0 0 300 64" preserveAspectRatio="none" aria-hidden="true">
          {TREND.map((t) => (
            <polyline key={t.label} points={t.pts} fill="none" stroke={t.color} strokeWidth="2.5" />
          ))}
        </svg>
        <div className="trend__legend">
          {TREND.map((t) => (
            <span key={t.label} className="trend__item">
              <i className="trend__dot" style={{ background: t.color }} />
              {t.label}
            </span>
          ))}
        </div>
        <div className="trend__cap">Tendencia comparada · muestra</div>
      </div>

      {copied && <div className="toast">Copiado ✓</div>}
    </>
  );
}
