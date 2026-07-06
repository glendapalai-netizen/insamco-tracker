// Cerebro de tasas del Convertidor Insamco.
// Fase 1: valores de muestra. Fase 2: tasas en vivo + Dólar Cúcuta que fija Sergio.

export type Code = "USD" | "COP" | "VES";

export const CUR: Record<Code, { label: string; name: string; perUSD: number }> = {
  USD: { label: "USD", name: "Dólar", perUSD: 1 },
  COP: { label: "COP", name: "Peso colombiano", perUSD: 4125.5 }, // Dólar Cúcuta (estrella)
  VES: { label: "Bs", name: "Bolívar", perUSD: 741.1 },
};

export const TRM = 3920.5; // referencia oficial del peso
export const ORDER: Code[] = ["USD", "COP", "VES"];

// Datos reales de Grupo Insamco (desde grupoinsamco.com)
export const WHATSAPP = "573507174992";
export const EMAIL = "sergio@grupoinsamco.com";
export const DIRECCION = "Avenida 7A # 19 N-50, Cúcuta, Norte de Santander, Colombia";
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Avenida%207A%20%23%2019%20N-50%2C%20C%C3%BAcuta%2C%20Norte%20de%20Santander%2C%20Colombia";

export const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

export function convert(amount: number, from: Code, to: Code) {
  const usd = amount / CUR[from].perUSD;
  return usd * CUR[to].perUSD;
}
