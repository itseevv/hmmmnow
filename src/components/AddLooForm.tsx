import { useState } from "react";
import type { PendingToiletInput } from "../types";
import { supabase, hasSupabase } from "../lib/supabase";

type Props = {
  onBack: () => void;
};

const accessOptions = ["免费可进", "问店员", "需要消费", "需要 code", "不太确定"];

export default function AddLooForm({ onBack }: Props) {
  const [form, setForm] = useState<PendingToiletInput>({ name: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locStatus, setLocStatus] = useState<"idle" | "done" | "denied">("idle");

  const set = (key: keyof PendingToiletInput, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const captureLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        setLocStatus("done");
      },
      () => setLocStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.name.trim()) {
      setError("先给这个救命地点起个名字。");
      return;
    }
    if (
      !form.area_or_address?.trim() &&
      !form.access_type &&
      !form.tip?.trim() &&
      !form.extra_note?.trim()
    ) {
      setError("再多给一点线索吧，不然我们也找不到它。");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form };
      if (payload.access_type !== "需要 code") {
        delete payload.code;
      }
      if (hasSupabase && supabase) {
        const { error: dbErr } = await supabase
          .from("pending_toilets")
          .insert([payload]);
        if (dbErr) throw dbErr;
      }
      setSuccess(true);
    } catch {
      setError("提交失败了，再试一次？");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <div className="text-5xl mb-6">🙏</div>
        <p className="text-lg font-semibold text-gray-700 mb-2">
          收到。等我们确认一下，它就能加入救命地图。
        </p>
        <button
          onClick={onBack}
          className="mt-6 text-sm text-gray-400 underline"
        >
          回首页
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <button onClick={onBack} className="text-sm text-gray-400 mb-4 inline-block">
        ← 回首页
      </button>
      <h2 className="text-xl font-bold text-gray-800 mb-1">你也知道一个？</h2>
      <p className="text-sm text-gray-400 mb-6">救人一急，功德 +1。</p>

      <div className="space-y-4">
        <Field label="地点名 *" value={form.name} onChange={(v) => set("name", v)} />
        <Field
          label="大概地址 / 区域"
          value={form.area_or_address ?? ""}
          onChange={(v) => set("area_or_address", v)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">进入方式</label>
          <select
            value={form.access_type ?? ""}
            onChange={(e) => set("access_type", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white"
          >
            <option value="">选一个</option>
            {accessOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        {form.access_type === "需要 code" && (
          <Field
            label="你懂的"
            value={form.code ?? ""}
            onChange={(v) => set("code", v)}
          />
        )}
        <TextArea label="位置或进入小提示" value={form.tip ?? ""} onChange={(v) => set("tip", v)} />
        <TextArea label="补充说明" value={form.extra_note ?? ""} onChange={(v) => set("extra_note", v)} />

        <div>
          {locStatus === "idle" && (
            <button
              type="button"
              onClick={captureLocation}
              className="text-sm text-blue-500 font-medium"
            >
              📍 用我现在的位置作为坐标
            </button>
          )}
          {locStatus === "done" && (
            <p className="text-sm text-green-600">✓ 已记录当前位置</p>
          )}
          {locStatus === "denied" && (
            <p className="text-sm text-gray-400">没关系，也可以只提交文字线索</p>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full mt-6 bg-green-500 hover:bg-green-600 active:scale-95 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-all"
      >
        {submitting ? "提交中……" : "提交这个救命地点"}
      </button>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none"
      />
    </div>
  );
}
