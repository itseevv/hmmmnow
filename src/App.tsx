import { useState } from "react";
import type { ViewState } from "./types";
import Home from "./components/Home";
import PanicMode from "./components/PanicMode";
import AddLooForm from "./components/AddLooForm";
import Leaderboard from "./components/Leaderboard";

const scatter = [
  { e: "🧻", top: "8%", left: "4%", rot: -12, size: 56 },
  { e: "⭐", top: "22%", right: "6%", rot: 8, size: 48 },
  { e: "💧", top: "48%", left: "8%", rot: 15, size: 64 },
  { e: "🎈", top: "68%", right: "4%", rot: -8, size: 52 },
  { e: "🚽", top: "82%", left: "12%", rot: 20, size: 44 },
];

export default function App() {
  const [view, setView] = useState<ViewState>("home");

  return (
    <div className="min-h-screen relative" style={{ background: "var(--page)" }}>
      <div className="scatter-bg">
        {scatter.map((s, i) => (
          <span
            key={i}
            style={{
              top: s.top,
              left: s.left,
              right: s.right,
              transform: `rotate(${s.rot}deg)`,
              fontSize: `${s.size}px`,
            }}
          >
            {s.e}
          </span>
        ))}
      </div>

      <div className="relative z-[1] max-w-[430px] mx-auto">
        {view === "home" && (
          <Home
            onPanic={() => setView("panic")}
            onAdd={() => setView("add")}
            onLeaderboard={() => setView("leaderboard")}
          />
        )}
        {view === "panic" && (
          <PanicMode
            onBack={() => setView("home")}
            onAdd={() => setView("add")}
          />
        )}
        {view === "add" && (
          <AddLooForm onBack={() => setView("home")} />
        )}
        {view === "leaderboard" && (
          <Leaderboard onBack={() => setView("home")} />
        )}
      </div>
    </div>
  );
}
