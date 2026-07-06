import { useMemo, useState } from "react";
import { CUR, ORDER, TRM, WHATSAPP, fmt, convert, type Code } from "../lib/rates";

export default function Converter() {
  const [from, setFrom] = useState<Code>("USD");
  const [to, setTo] = useState<Code>("COP");
  const [amount, setAmount] = useState("1");
  const [copied, setCopied] = useState(false);

  const value = parseFloat(amount.replace(",", ".")) || 0;
  const result = useMemo(() => convert(value, from, to), [value, from, to]);

  const press = (k: string) => {
    setCopied(false);
    if (k === "C") return setAmount("");
    if (k === "<") return setAmount((a) => a.slice(0, -1));
    if (k === ",") return setAmount((a) => (a.includes(",") ? a : (a || "0") + ","));
    setAmount((a) => {
      if (a === "0" || a === "") return k;
      if (a.replace(/[.,]/g, "").length >= 12) return a;
      return a + k;
    });
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    setCopied(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.toFixed(2));
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", ",", "0", "<"];

  return (
    <>
      <header className="brand">
        <img className="brand__logo" src="/logo.png" alt="Grupo Insamco" />
        <div className="brand__name">GRUPO INSAMCO</div>
        <div className="brand__sub">Convertidor</div>
      </header>

      <section className="card">
        <div className="row">
          <select
            className="row__cur"
            value={from}
            onChange={(e) => setFrom(e.target.value as Code)}
            aria-label="Moneda de origen"
          >
            {ORDER.map((c) => (
              <option key={c} value={c}>
                {CUR[c].label}
              </option>
            ))}
          </select>
          <div className="row__val">{amount || "0"}</div>
        </div>

        <button className="swap" onClick={swap} aria-label="Intercambiar monedas">
          ⇅
        </button>

        <div className="row row--to">
          <select
            className="row__cur"
            value={to}
            onChange={(e) => setTo(e.target.value as Code)}
            aria-label="Moneda de destino"
          >
            {ORDER.map((c) => (
              <option key={c} value={c}>
                {CUR[c].label}
              </option>
            ))}
          </select>
          <div className="row__val">{fmt(result)}</div>
          <button className="copy" onClick={copy} aria-label="Copiar resultado" title="Copiar">
            ⧉
          </button>
        </div>
      </section>

      <div className="ref">
        <span>
          <span className="ref__star">★ Dólar Cúcuta</span> · 1 USD = {fmt(CUR.COP.perUSD)} COP
        </span>
        <span className="ref__trm">TRM oficial de referencia: {fmt(TRM)}</span>
      </div>

      <div className="pad">
        {keys.map((k) => (
          <button key={k} className="key" onClick={() => press(k)}>
            {k === "<" ? "⌫" : k}
          </button>
        ))}
      </div>
      <div className="actions">
        <button className="key key--ghost" onClick={() => press("C")}>
          Limpiar
        </button>
        <button className="key key--gold" onClick={copy}>
          Copiar resultado
        </button>
      </div>

      <a className="wa" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
        <span>💬</span> Escríbenos por WhatsApp
      </a>

      {copied && <div className="toast">Copiado ✓</div>}
    </>
  );
}
