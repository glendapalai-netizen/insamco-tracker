import { useEffect, useState } from "react";
import "./splash.css";

// Portadas de marca (Sergio / Mei). Se elige una al azar en cada apertura.
const COVERS = ["/sergio.jpg", "/mei.jpg"];

export default function Splash({ onDone }: { onDone: () => void }) {
  const [img] = useState(() => COVERS[Math.floor(Math.random() * COVERS.length)]);
  const [leaving, setLeaving] = useState(false);

  const close = () => {
    setLeaving(true);
    setTimeout(onDone, 450);
  };

  useEffect(() => {
    const t = setTimeout(close, 3200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`splash ${leaving ? "is-leaving" : ""}`} onClick={close}>
      <img className="splash__img" src={img} alt="Grupo Insamco" />
      <div className="splash__hint">Toca para entrar</div>
    </div>
  );
}
