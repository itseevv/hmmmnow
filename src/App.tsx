import { useState } from "react";
import type { ViewState } from "./types";
import Home from "./components/Home";
import PanicMode from "./components/PanicMode";
import AddLooForm from "./components/AddLooForm";

export default function App() {
  const [view, setView] = useState<ViewState>("home");

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="max-w-[430px] mx-auto">
        {view === "home" && (
          <Home
            onPanic={() => setView("panic")}
            onAdd={() => setView("add")}
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
      </div>
    </div>
  );
}
