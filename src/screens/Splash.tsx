import { useState } from "react";
import "./splash.css";

// Portadas de marca (Sergio / Mei). Se elige una al azar en cada apertura.
const COVERS = ["/sergio.jpg", "/mei.jpg"];

export default function Splash({ onDone }: { onDone: () => void }) {
  const [img] = useState(() => COVERS[Math.floor(Math.random() * COVERS.length)]);
  const [loaded, setLoaded] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const enter = () => {
    setLeaving(true);
    setTimeout(onDone, 450);
  };

  return (
    <div className={`splash ${leaving ? "is-leaving" : ""}`}>
      <img
        className="splash__img"
        src={img}
        alt="Grupo Insamco"
        onLoad={() => setLoaded(true)}
      />
      {loaded ? (
        <button className="splash__enter" onClick={enter}>
          Entrar →
        </button>
      ) : (
        <div className="splash__loading">Cargando…</div>
      )}
    </div>
  );
}
