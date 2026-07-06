import { useState } from "react";
import { CUR, ORDER, TRM, WHATSAPP, convert, type Code } from "../lib/rates";

const nf = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Agrupa miles con punto, respetando lo que la persona va escribiendo (coma = decimal).
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
// Deja solo dígitos y una coma, máximo 2 decimales.
function sanitize(input: string): string {
  let s = input.replace(/\./g, "").replace(/[^\d,]/g, "");
  const i = s.indexOf(",");
  if (i !== -1) s = s.slice(0, i + 1) + s.slice(i + 1).replace(/,/g, "");
  const parts = s.split(",");
  return parts[1] !== undefined ? `${parts[0]},${parts[1].slice(0, 2)}` : parts[0];
}

export default function Converter() {
  const [from, setFrom] = useState<Code>("USD");
  const [to, setTo] = useState<Code>("COP");
  const [editField, setEditField] = useState<"from" | "to">("from");
  const [raw, setRaw] = useState("1");
  const [copied, setCopied] = useState(false);

  const value = toNumber(raw);
  const fromNum = editField === "from" ? value : convert(value, to, from);
  const toNum = editField === "to" ? value : convert(value, from, to);

  const fromDisplay = editField === "from" ? group(raw) : nf.format(fromNum);
  const toDisplay = editField === "to" ? group(raw) : nf.format(toNum);

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
                  {CUR[c].label}
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
          <span className="ref__star">★ Dólar Cúcuta</span> · 1 USD = {nf.format(CUR.COP.perUSD)} COP
        </span>
        <span className="ref__trm">TRM oficial de referencia: {nf.format(TRM)}</span>
      </div>

      <p className="tip">Toca cualquier cifra para escribirla · Toca ⧉ para copiar y pegar en tu banco</p>

      <a className="wa" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
        <span>💬</span> Escríbenos por WhatsApp
      </a>

      {copied && <div className="toast">Copiado ✓</div>}
    </>
  );
}
