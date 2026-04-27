type Props = {
  type: "denied" | "error" | "empty";
  onAdd?: () => void;
};

export default function ErrorState({ type, onAdd }: Props) {
  if (type === "denied") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="text-5xl mb-6">📍</div>
        <p className="text-lg font-semibold text-gray-700 mb-2">
          定位失败了，但问题不大。
        </p>
        <p className="text-sm text-gray-400">
          你还是可以先看看附近地图。
        </p>
      </div>
    );
  }

  if (type === "empty") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="text-5xl mb-6">🫥</div>
        <p className="text-lg font-semibold text-gray-700 mb-2">
          附近暂时没有收录厕所。
        </p>
        <p className="text-sm text-gray-400 mb-6">
          这不是你的问题，是我们的数据库还不够努力。
        </p>
        {onAdd && (
          <button
            onClick={onAdd}
            className="bg-white text-gray-700 font-medium py-3 px-6 rounded-full shadow border border-gray-200"
          >
            ➕ 我也知道一个
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="text-5xl mb-6">😵</div>
      <p className="text-lg font-semibold text-gray-700 mb-2">
        出了点问题……
      </p>
      <p className="text-sm text-gray-400">
        刷新试试？或者直接 Google Maps 搜 toilet 吧。
      </p>
    </div>
  );
}
