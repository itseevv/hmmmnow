export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="text-5xl mb-6 animate-bounce">🚽</div>
      <p className="text-lg font-semibold text-gray-700 mb-2">
        正在帮你找救命厕所……
      </p>
      <p className="text-sm text-gray-400">
        别慌，地图已经开始努力了。
      </p>
    </div>
  );
}
