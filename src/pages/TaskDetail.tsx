import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { TaskStatus } from "../types";
import {
  applyTask,
  awardTask,
  completeTask,
  currentUser,
  formatDate,
  formatMoney,
  useStore,
} from "../store";

const labels: Record<TaskStatus, string> = {
  open: "招募中",
  in_progress: "开发中",
  done: "已完成",
};

export default function TaskDetail() {
  const { id } = useParams();
  const store = useStore();
  const me = currentUser(store);
  const task = store.tasks.find((t) => t.id === id);
  const apps = store.applications.filter((a) => a.taskId === id);
  const [pitch, setPitch] = useState("");
  const [days, setDays] = useState(14);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  if (!task) {
    return (
      <div className="empty panel">
        任务不存在。<Link to="/tasks">返回</Link>
      </div>
    );
  }

  const isOwner = me?.id === task.authorId;
  const already = me ? apps.some((a) => a.developerId === me.id) : false;

  function onApply(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      applyTask(id!, pitch.trim(), days);
      setPitch("");
      setMsg("申请已提交，等待发布者选定。");
    } catch (error) {
      setErr((error as Error).message);
    }
  }

  return (
    <div className="detail">
      <article className="panel stack">
        <span className={`badge ${task.status}`}>{labels[task.status]}</span>
        <h1>{task.title}</h1>
        <p className="task-body">{task.description}</p>
        <div className="tags">
          {task.skills.map((s) => (
            <span className="tag" key={s}>
              {s}
            </span>
          ))}
        </div>
        {task.status === "open" && !isOwner ? (
          <form className="stack" onSubmit={onApply}>
            <h3>申请开发</h3>
            <textarea
              rows={4}
              placeholder="说明你怎么做、交付什么、有没有同类案例"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              required
              minLength={8}
              disabled={already}
            />
            <label className="field">
              你能接受的工期（天）
              <input
                type="number"
                min={1}
                max={180}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                disabled={already}
              />
            </label>
            {err ? <div className="notice">{err}</div> : null}
            {msg ? <div className="success">{msg}</div> : null}
            <button className="btn" disabled={already}>
              {already ? "已申请" : "提交申请"}
            </button>
          </form>
        ) : null}
        {task.status === "in_progress" && isOwner ? (
          <button
            className="btn"
            onClick={() => {
              try {
                completeTask(task.id);
              } catch (e) {
                setErr((e as Error).message);
              }
            }}
          >
            确认验收完成
          </button>
        ) : null}
      </article>
      <aside className="panel stack">
        <h3>订单信息</h3>
        <div>
          预算 <b>{formatMoney(task.budget)}</b>
        </div>
        <div className="meta">期望工期 {task.days} 天</div>
        <div className="meta">发布者 {task.authorName}</div>
        <div className="meta">{formatDate(task.createdAt)}</div>
        {task.assigneeName ? <div>承接人 {task.assigneeName}</div> : null}
        <h3>申请列表 · {apps.length}</h3>
        {apps.length === 0 ? <div className="muted">还没有人申请。</div> : null}
        {apps.map((a) => (
          <div className="app" key={a.id}>
            <div>
              <b>{a.developerName}</b>
              <div className="meta">承诺 {a.days} 天 · {formatDate(a.createdAt)}</div>
              <p>{a.pitch}</p>
              {isOwner && task.status === "open" ? (
                <button className="btn" onClick={() => awardTask(task.id, a.developerId)}>
                  选定此人开发
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}
