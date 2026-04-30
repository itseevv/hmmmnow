import { useState } from "react";
import { supabase, hasSupabase } from "../lib/supabase";

type Props = {
  toiletId: string;
  onClose: () => void;
};

type ReportOption = {
  label: string;
  value: "cannot_access" | "wrong_code" | "closed" | "wrong_location" | "other";
  notePlaceholder?: string;
};

const reportOptions: ReportOption[] = [
  { label: "进不去", value: "cannot_access" },
  { label: "密码不对", value: "wrong_code", notePlaceholder: "可以写一下现在的密码/情况" },
  { label: "已经关了", value: "closed" },
  { label: "位置不准", value: "wrong_location" },
  { label: "其他", value: "other", notePlaceholder: "可以简单说一下哪里不对" },
];

export default function ReportSheet({ toiletId, onClose }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<ReportOption | null>(null);
  const [note, setNote] = useState("");

  const submit = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError("");
    try {
      const noteValue = selected.notePlaceholder && note.trim() ? note.trim() : null;
      if (hasSupabase && supabase) {
        const { error: insertErr } = await supabase
          .from("toilet_reports")
          .insert([{ toilet_id: toiletId, report_type: selected.value, note: noteValue }]);
        if (insertErr) throw insertErr;
        await supabase.rpc("update_toilet_confidence", { target_toilet_id: toiletId });
      }
      setDone(true);
    } catch {
      setError("提交失败了，再试一次？");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="r-success">
        <div className="text-3xl mb-1">🫶</div>
        <p className="text-sm font-bold mb-2" style={{ color: "var(--mint-deep)" }}>
          收到，我们会重新确认这个点。
        </p>
        <button onClick={onClose} className="r-cancel">
          收起
        </button>
      </div>
    );
  }

  const showNote = selected?.notePlaceholder !== undefined;

  return (
    <div className="report-panel">
      <p className="report-q">怎么不对？</p>
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {reportOptions.map((opt) => {
          const isSelected = selected?.value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => {
                setSelected(opt);
                setNote("");
              }}
              disabled={submitting}
              className={`r-chip ${isSelected ? "is-selected" : ""}`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {showNote && (
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={selected?.notePlaceholder}
          className="r-input"
        />
      )}

      <button
        onClick={() => void submit()}
        disabled={submitting || !selected}
        className="r-submit disabled:opacity-50"
      >
        {submitting ? "提交中……" : "提交"}
      </button>

      {error && <p className="text-red-500 text-xs mt-1 mb-2">{error}</p>}

      <button onClick={onClose} className="r-cancel">
        算了
      </button>
    </div>
  );
}
