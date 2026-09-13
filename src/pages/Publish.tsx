import { FormEvent, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CATEGORIES } from "../seed";
import { addIdea, addMiniApp, addTask } from "../store";

type Tab = "miniapp" | "idea" | "task";

export default function Publish() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") as Tab) || "miniapp";
  const navigate = useNavigate();

  function setTab(next: Tab) {
    setParams({ tab: next });
  }

  return (
    <>
      <div className="kicker">PUBLISH</div>
      <h1>发布到微集</h1>
      <p className="lead">选一种你现在想做的事：收录产品、丢一个点子，或挂出带预算的开发需求。</p>
      <div className="tabs">
        <button className={`chip ${tab === "miniapp" ? "on" : ""}`} onClick={() => setTab("miniapp")}>
          收录小程序
        </button>
        <button className={`chip ${tab === "idea" ? "on" : ""}`} onClick={() => setTab("idea")}>
          灵感点子
        </button>
        <button className={`chip ${tab === "task" ? "on" : ""}`} onClick={() => setTab("task")}>
          需求任务
        </button>
      </div>
      {tab === "miniapp" ? <MiniAppForm onDone={(id) => navigate(`/miniapps/${id}`)} /> : null}
      {tab === "idea" ? <IdeaForm onDone={(id) => navigate(`/ideas/${id}`)} /> : null}
      {tab === "task" ? <TaskForm onDone={(id) => navigate(`/tasks/${id}`)} /> : null}
    </>
  );
}

function splitTags(raw: string) {
  return raw
    .split(/[,，\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function MiniAppForm({ onDone }: { onDone: (id: string) => void }) {
  const [err, setErr] = useState("");
  const hue = useMemo(() => Math.floor(Math.random() * 360), []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const item = addMiniApp({
        name: String(fd.get("name")),
        appId: String(fd.get("appId")),
        category: String(fd.get("category")),
        summary: String(fd.get("summary")),
        description: String(fd.get("description")),
        tags: splitTags(String(fd.get("tags") || "")),
        coverHue: hue,
      });
      onDone(item.id);
    } catch (error) {
      setErr((error as Error).message);
    }
  }

  return (
    <form className="panel form-grid" onSubmit={onSubmit}>
      <Field name="name" label="小程序名称" required />
      <Field name="appId" label="AppId" placeholder="wx…" required />
      <label className="field">
        品类
        <select name="category" defaultValue={CATEGORIES[0]}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <Field name="tags" label="标签（逗号分隔）" placeholder="核销, 会员" />
      <Field className="full" name="summary" label="一句话介绍" required />
      <label className="field full">
        详情
        <textarea name="description" rows={5} required />
      </label>
      {err ? <div className="notice full">{err}</div> : null}
      <div className="full">
        <button className="btn">提交收录</button>
      </div>
    </form>
  );
}

function IdeaForm({ onDone }: { onDone: (id: string) => void }) {
  const [err, setErr] = useState("");
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const idea = addIdea(
        String(fd.get("title")),
        String(fd.get("body")),
        splitTags(String(fd.get("tags") || "")),
      );
      onDone(idea.id);
    } catch (error) {
      setErr((error as Error).message);
    }
  }
  return (
    <form className="panel form-grid" onSubmit={onSubmit}>
      <Field className="full" name="title" label="点子标题" required />
      <label className="field full">
        把场景和卡点写清楚
        <textarea name="body" rows={6} required minLength={10} />
      </label>
      <Field className="full" name="tags" label="标签" placeholder="适老化, 健康" />
      {err ? <div className="notice full">{err}</div> : null}
      <div className="full">
        <button className="btn">发布灵感</button>
      </div>
    </form>
  );
}

function TaskForm({ onDone }: { onDone: (id: string) => void }) {
  const [err, setErr] = useState("");
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const task = addTask({
        title: String(fd.get("title")),
        description: String(fd.get("description")),
        budget: Number(fd.get("budget")),
        days: Number(fd.get("days")),
        skills: splitTags(String(fd.get("skills") || "")),
      });
      onDone(task.id);
    } catch (error) {
      setErr((error as Error).message);
    }
  }
  return (
    <form className="panel form-grid" onSubmit={onSubmit}>
      <Field className="full" name="title" label="任务标题" required />
      <label className="field">
        预算（元）
        <input name="budget" type="number" min={100} required defaultValue={5000} />
      </label>
      <label className="field">
        工期（天）
        <input name="days" type="number" min={1} required defaultValue={14} />
      </label>
      <Field className="full" name="skills" label="技能标签" placeholder="云开发, 支付" />
      <label className="field full">
        需求说明
        <textarea name="description" rows={6} required minLength={10} />
      </label>
      {err ? <div className="notice full">{err}</div> : null}
      <div className="full">
        <button className="btn">发布需求</button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  required,
  placeholder,
  className,
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`field ${className ?? ""}`}>
      {label}
      <input name={name} required={required} placeholder={placeholder} />
    </label>
  );
}
