import { WHATSAPP, EMAIL, DIRECCION, MAPS_URL } from "../lib/rates";

const PRODUCTOS = [
  "Dióxido de titanio",
  "Resinas",
  "Aditivos",
  "Cargas minerales",
  "Solventes",
  "Recubrimientos",
];

const COTIZAR = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
  "Hola Grupo Insamco 👋, quiero cotizar materias primas."
)}`;

export default function Tarjeta() {
  return (
    <div className="screen">
      <header className="brand">
        <img className="brand__logo" src="/logo.png" alt="Grupo Insamco" />
        <div className="brand__name">GRUPO INSAMCO S.A.S.</div>
        <div className="brand__sub">Materias primas para la industria</div>
        <p className="tagline">Tu aliado estratégico · Cúcuta, Colombia · Desde 2015</p>
      </header>

      <section className="block">
        <h2 className="block__title">Qué distribuimos</h2>
        <div className="chips">
          {PRODUCTOS.map((p) => (
            <span key={p} className="chip">
              {p}
            </span>
          ))}
        </div>
      </section>

      <section className="block">
        <h2 className="block__title">Contáctanos</h2>
        <a className="line line--wa" href={COTIZAR} target="_blank" rel="noreferrer">
          <span className="line__ico">💬</span>
          <span>
            <b>Cotizar por WhatsApp</b>
            <small>+57 350 717 4992</small>
          </span>
        </a>
        <a className="line" href={`mailto:${EMAIL}`}>
          <span className="line__ico">✉️</span>
          <span>
            <b>Escríbenos un correo</b>
            <small>{EMAIL}</small>
          </span>
        </a>
        <a className="line" href={MAPS_URL} target="_blank" rel="noreferrer">
          <span className="line__ico">📍</span>
          <span>
            <b>Cómo llegar (abre el GPS)</b>
            <small>{DIRECCION}</small>
          </span>
        </a>
      </section>

      <section className="block">
        <h2 className="block__title">Grupo Insamco en movimiento</h2>
        <video className="video" src="/video.mp4" controls playsInline preload="metadata" poster="/logo.png" />
      </section>

      <p className="foot">Grupo Insamco S.A.S. · Cúcuta, Colombia · sin publicidad</p>
    </div>
  );
}
