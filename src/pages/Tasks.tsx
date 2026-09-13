import { Link } from "react-router-dom";
import type { TaskStatus } from "../types";
import { formatMoney, useStore } from "../store";

const labels: Record<TaskStatus, string> = {
  open: "招募中",
  in_progress: "开发中",
  done: "已完成",
};

export default function Tasks() {
  const { tasks, applications } = useStore();

  return (
    <>
      <div className="kicker">GIGS</div>
      <h1>需求广场</h1>
      <p className="lead">带预算、带工期的真实需求。开发者可以提交方案申请；发布者选定后进入开发。</p>
      <div className="toolbar">
        <Link className="btn" to="/publish?tab=task">
          发布需求
        </Link>
      </div>
      <div className="stack">
        {tasks.map((t) => {
          const apps = applications.filter((a) => a.taskId === t.id).length;
          return (
            <Link className="panel" key={t.id} to={`/tasks/${t.id}`}>
              <div className="profile-hero">
                <div>
                  <span className={`badge ${t.status}`}>{labels[t.status]}</span>
                  <h3>{t.title}</h3>
                  <p className="muted">{t.description.slice(0, 100)}…</p>
                  <div className="tags">
                    {t.skills.map((s) => (
                      <span className="tag" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <b>{formatMoney(t.budget)}</b>
                  <div className="meta">{t.days} 天 · {apps} 份申请</div>
                  <div className="meta">{t.authorName}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
