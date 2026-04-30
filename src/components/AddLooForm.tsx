import { useState } from "react";
import type { PendingToiletInput } from "../types";
import { supabase, hasSupabase } from "../lib/supabase";

type Props = {
  onBack: () => void;
};

const accessOptions = ["免费可进", "问店员", "需要消费", "需要 code", "不太确定"];

export default function AddLooForm({ onBack }: Props) {
  const [form, setForm] = useState<PendingToiletInput>({ name: "", is_anonymous: false });
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
    if (form.is_anonymous === false && !form.submitter_name?.trim()) {
      setError("不想留名的话，可以选择匿名提交");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form };
      if (payload.access_type !== "需要 code") {
        delete payload.code;
      }
      if (payload.is_anonymous) {
        payload.submitter_name = null;
      } else {
        payload.submitter_name = payload.submitter_name?.trim() || null;
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
        <p
          className="text-lg font-bold mb-2"
          style={{ color: "var(--ink)" }}
        >
          收到。等我们确认一下，它就能加入救命地图。
        </p>
        <button
          onClick={onBack}
          className="mt-6 text-sm underline"
          style={{ color: "var(--soft)" }}
        >
          回首页
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <button
        onClick={onBack}
        className="text-sm mb-4 inline-block"
        style={{ color: "var(--soft)" }}
      >
        ← 回首页
      </button>
      <h2 className="text-2xl font-extrabold mb-1" style={{ color: "var(--ink)" }}>
        你也知道一处宝地？
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--soft)" }}>
        救人一急，功德 +1。
      </p>

      <div className="space-y-4">
        <Field label="地点名 *" value={form.name} onChange={(v) => set("name", v)} />
        <Field
          label="大概地址 / 区域"
          value={form.area_or_address ?? ""}
          onChange={(v) => set("area_or_address", v)}
        />
        <div>
          <label
            className="block text-xs font-extrabold uppercase tracking-wider mb-1"
            style={{ color: "var(--soft)" }}
          >
            进入方式
          </label>
          <select
            value={form.access_type ?? ""}
            onChange={(e) => set("access_type", e.target.value)}
            className="w-full border-2 rounded-xl px-4 py-3 text-sm bg-white"
            style={{ borderColor: "#ece1cd", color: "var(--ink)" }}
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
              className="text-sm font-bold"
              style={{ color: "var(--blue)" }}
            >
              📍 用我现在的位置作为坐标
            </button>
          )}
          {locStatus === "done" && (
            <p className="text-sm font-bold" style={{ color: "var(--mint-deep)" }}>
              ✓ 已记录当前位置
            </p>
          )}
          {locStatus === "denied" && (
            <p className="text-sm" style={{ color: "var(--soft)" }}>
              没关系，也可以只提交文字线索
            </p>
          )}
        </div>

        <div
          className="rounded-2xl p-4 border-2 border-dashed"
          style={{ background: "var(--parchment)", borderColor: "#d8c8a8" }}
        >
          <p className="text-sm font-extrabold mb-1" style={{ color: "var(--ink)" }}>
            留个名吗？
          </p>
          <p className="text-xs mb-3" style={{ color: "var(--soft)" }}>
            上榜的时候会显示这个名字。
          </p>
          {!form.is_anonymous && (
            <div className="mb-3">
              <label
                className="block text-xs font-extrabold uppercase tracking-wider mb-1"
                style={{ color: "var(--soft)" }}
              >
                尊姓大名
              </label>
              <input
                type="text"
                maxLength={15}
                value={form.submitter_name ?? ""}
                onChange={(e) => set("submitter_name", e.target.value)}
                placeholder="最多 15 个字"
                className="w-full border-2 rounded-xl px-4 py-3 text-sm bg-white"
                style={{ borderColor: "#ece1cd", color: "var(--ink)" }}
              />
            </div>
          )}
          <label className="flex items-center gap-2 text-sm" style={{ color: "var(--ink)" }}>
            <input
              type="checkbox"
              checked={form.is_anonymous === true}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_anonymous: e.target.checked }))
              }
              className="w-4 h-4"
            />
            匿名提交
          </label>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full mt-6 active:scale-95 disabled:opacity-50 text-white font-extrabold py-4 rounded-2xl transition-all"
        style={{
          background: "var(--mint-deep)",
          boxShadow: "0 4px 0 #3f6849",
        }}
      >
        {submitting ? "提交中……" : "提交这个救命地点"}
      </button>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label
        className="block text-xs font-extrabold uppercase tracking-wider mb-1"
        style={{ color: "var(--soft)" }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 rounded-xl px-4 py-3 text-sm bg-white"
        style={{ borderColor: "#ece1cd", color: "var(--ink)" }}
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label
        className="block text-xs font-extrabold uppercase tracking-wider mb-1"
        style={{ color: "var(--soft)" }}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full border-2 rounded-xl px-4 py-3 text-sm resize-none bg-white"
        style={{ borderColor: "#ece1cd", color: "var(--ink)" }}
      />
    </div>
  );
}
