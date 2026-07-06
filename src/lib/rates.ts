// Cerebro de tasas del Convertidor Insamco.
// Dólar Cúcuta = TRM oficial (en vivo, banrep) + MARGEN de frontera.
// El TRM ("Wall Street") NO es la tasa de Cúcuta ("el muro en la calle"): la de
// Cúcuta = TRM + margen, que varía con el efectivo del día (regla de la frontera).

export type Code = "USD" | "USDT" | "COP" | "VES";

// Margen de frontera sobre el TRM. Hoy (6-jul) el real ~+4% (venta $100).
// Ajustable — Fase 2b: lo fijará Sergio viendo el cartel de William.
export const MARGEN = 0.04;

// Bolívar por dólar (paralelo). Fase 2b: en vivo.
export const VES_PER_USD = 744.53;

// TRM de respaldo si no hay internet (real 04–06 jul, banrep.gov.co).
export const TRM_FALLBACK = 3334.93;

export const ORDER: Code[] = ["COP", "VES", "USD", "USDT"];

export function buildCur(
  trm: number
): Record<Code, { label: string; name: string; perUSD: number }> {
  const cucuta = Math.round(trm * (1 + MARGEN) * 100) / 100; // Dólar Cúcuta
  return {
    USD: { label: "USD", name: "Dólar", perUSD: 1 },
    USDT: { label: "USDT", name: "USDT", perUSD: 1 },
    COP: { label: "COP", name: "Peso colombiano", perUSD: cucuta },
    VES: { label: "Bs", name: "Bolívar", perUSD: VES_PER_USD },
  };
}

export type LiveTrm = { trm: number; date: string; live: boolean };

// Jala el TRM oficial del día desde la API pública del gobierno colombiano.
export async function fetchTrm(): Promise<LiveTrm> {
  try {
    const res = await fetch(
      "https://www.datos.gov.co/resource/32sa-8pi3.json?$order=vigenciadesde%20DESC&$limit=1",
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) throw new Error("status " + res.status);
    const data = await res.json();
    const trm = parseFloat(data?.[0]?.valor);
    const date = String(data?.[0]?.vigenciadesde || "").slice(0, 10);
    if (!Number.isFinite(trm)) throw new Error("sin valor");
    return { trm, date, live: true };
  } catch {
    return { trm: TRM_FALLBACK, date: "2026-07-06", live: false };
  }
}

// Datos reales de Grupo Insamco (desde grupoinsamco.com)
export const WHATSAPP = "573507174992";
export const EMAIL_SERGIO = "sergio@grupoinsamco.com";
export const EMAIL_ANDREA = "andreaosorio@grupoinsamco.com";
export const DIRECCION = "Avenida 7A # 19 N-50, Cúcuta, Norte de Santander, Colombia";
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Avenida%207A%20%23%2019%20N-50%2C%20C%C3%BAcuta%2C%20Norte%20de%20Santander%2C%20Colombia";

export const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

export function convert(
  amount: number,
  from: Code,
  to: Code,
  cur: Record<Code, { perUSD: number }>
) {
  const usd = amount / cur[from].perUSD;
  return usd * cur[to].perUSD;
}
