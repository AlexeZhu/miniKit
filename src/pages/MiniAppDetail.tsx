import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { bumpMiniAppViews, formatDate, useStore } from "../store";
import { hue } from "./Home";

export default function MiniAppDetail() {
  const { id } = useParams();
  const { miniApps } = useStore();
  const app = miniApps.find((m) => m.id === id);

  useEffect(() => {
    if (!id) return;
    const key = `weiji-viewed-${id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    bumpMiniAppViews(id);
  }, [id]);

  if (!app) {
    return (
      <div className="empty panel">
        找不到这个小程序。
        <div>
          <Link to="/miniapps">返回馆藏</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail">
      <article className="panel stack">
        <div className="cover" style={{ background: hue(app.coverHue), height: 140 }}>
          {app.name}
        </div>
        <div className="kicker">{app.category}</div>
        <h1>{app.name}</h1>
        <p className="lead">{app.summary}</p>
        <p className="idea-body">{app.description}</p>
        <div className="tags">
          {app.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </article>
      <aside className="panel stack">
        <h3>收录信息</h3>
        <div className="meta">AppId</div>
        <code>{app.appId}</code>
        <div className="meta">提交人 · {app.author}</div>
        <div className="meta">收录于 {formatDate(app.createdAt)}</div>
        <div className="meta">{app.views} 次浏览</div>
        <p className="muted">请在微信中搜索名称或使用 AppId 打开。本站仅做目录，不托管代码。</p>
        <Link className="btn secondary" to="/miniapps">
          返回列表
        </Link>
      </aside>
    </div>
  );
}
