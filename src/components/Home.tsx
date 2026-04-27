type Props = {
  onPanic: () => void;
  onAdd: () => void;
};

export default function Home({ onPanic, onAdd }: Props) {
  return (
    <div className="flex flex-col items-center min-h-dvh px-6 text-center">
      {/* Top section */}
      <div className="pt-16 pb-4">
        <h1 className="text-4xl font-bold tracking-tight mb-3">HmmmNow</h1>
        <p className="text-xl text-gray-700 mb-2">在伦敦，突然 Hmmmm？</p>
        <p className="text-base text-gray-500">看看附近的💩点</p>
      </div>

      {/* Hero */}
      <div className="text-[120px] leading-none py-8 animate-[float_3s_ease-in-out_infinite]">🚽</div>

      {/* CTA section */}
      <div className="w-full flex flex-col items-center pt-4 pb-2">
        <button
          onClick={onPanic}
          className="w-full max-w-xs bg-red-500 hover:bg-red-600 active:scale-95 text-white text-xl font-bold py-5 px-8 rounded-full shadow-lg transition-all mb-4"
        >
          🚨 快憋不住啦！
        </button>

        <button
          onClick={onAdd}
          className="w-full max-w-xs bg-white hover:bg-gray-50 text-gray-700 text-base font-medium py-3 px-6 rounded-full shadow border border-gray-200 transition-all mb-4"
        >
          ➕ 我也知道一个
        </button>

        <p className="text-xs text-gray-400">已收录 42 个救命地点</p>
      </div>

      {/* Footer disclaimer */}
      <p className="mt-auto pt-6 pb-6 text-[10px] text-gray-300">
        厕所信息可能会变。请友好使用，别为难 staff。
      </p>
    </div>
  );
}
