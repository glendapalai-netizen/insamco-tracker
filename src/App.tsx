import { useState } from "react";
import "./screens.css";
import Splash from "./screens/Splash";
import Converter from "./screens/Converter";
import Historico from "./screens/Historico";
import Tarjeta from "./screens/Tarjeta";

type Tab = "conv" | "hist" | "card";

export default function App() {
  const [splash, setSplash] = useState(true);
  const [tab, setTab] = useState<Tab>("conv");

  if (splash) return <Splash onDone={() => setSplash(false)} />;

  return (
    <div className="app">
      <div className="shell">
        {tab === "conv" && <Converter />}
        {tab === "hist" && <Historico />}
        {tab === "card" && <Tarjeta />}
      </div>

      <nav className="nav">
        <button className={`nav__i ${tab === "conv" ? "is-on" : ""}`} onClick={() => setTab("conv")}>
          <span className="nav__ico">⇄</span>
          Conversor
        </button>
        <button className={`nav__i ${tab === "hist" ? "is-on" : ""}`} onClick={() => setTab("hist")}>
          <span className="nav__ico">📈</span>
          Histórico
        </button>
        <button className={`nav__i ${tab === "card" ? "is-on" : ""}`} onClick={() => setTab("card")}>
          <span className="nav__ico">🪪</span>
          Insamco
        </button>
      </nav>
    </div>
  );
}
