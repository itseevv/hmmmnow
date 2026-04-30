export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div
        className="text-6xl mb-6"
        style={{ animation: "float 2s ease-in-out infinite" }}
      >
        🚽
      </div>
      <p className="text-lg font-extrabold mb-2" style={{ color: "var(--ink)" }}>
        正在帮你找救命厕所……
      </p>
      <p className="text-sm" style={{ color: "var(--soft)" }}>
        别慌，地图已经开始努力了。
      </p>
    </div>
  );
}
