import { Link } from "react-router-dom";
import { currentUser, formatMoney, useStore } from "../store";

export default function Home() {
  const store = useStore();
  const me = currentUser(store);
  const openTasks = store.tasks.filter((t) => t.status === "open").length;
  const featured = store.miniApps.filter((m) => m.featured);
  const hotIdeas = [...store.ideas].sort((a, b) => b.supportIds.length - a.supportIds.length).slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="kicker">MINIAPP · IDEA · GIG</div>
          <h1>把小程序、灵感和开发订单放在同一张桌上。</h1>
          <p className="lead">
            收录值得被看见的微信小程序，让点子被支持与讨论，再把带预算、带工期的需求交给愿意接的开发者。
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/publish">
              发布收录 / 点子 / 需求
            </Link>
            <Link className="btn secondary" to="/tasks">
              去接一单
            </Link>
          </div>
        </div>
        <aside className="hero-panel">
          <div className="meta">你好，{me?.name}</div>
          <div className="stat-row">
            <div className="stat">
              <b>{store.miniApps.length}</b>
              <span>已收录小程序</span>
            </div>
            <div className="stat">
              <b>{store.ideas.length}</b>
              <span>公开灵感</span>
            </div>
            <div className="stat">
              <b>{openTasks}</b>
              <span>正在招募的任务</span>
            </div>
          </div>
          <p className="muted">
            数据保存在本机浏览器。右上角可切换演示账号，或在「我的」里登记新身份。
          </p>
        </aside>
      </section>

      <div className="section-head">
        <h2>馆藏精选</h2>
        <Link to="/miniapps">进入小程序馆 →</Link>
      </div>
      <div className="grid">
        {featured.map((m) => (
          <Link className="card" key={m.id} to={`/miniapps/${m.id}`}>
            <div className="cover" style={{ background: hue(m.coverHue) }}>
              {m.name.slice(0, 2)}
            </div>
            <h3>{m.name}</h3>
            <p className="muted">{m.summary}</p>
            <div className="tags">
              <span className="tag">{m.category}</span>
              {m.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div className="section-head">
        <h2>正在被支持的点子</h2>
        <Link to="/ideas">灵感墙 →</Link>
      </div>
      <div className="grid">
        {hotIdeas.map((idea) => (
          <Link className="card" key={idea.id} to={`/ideas/${idea.id}`}>
            <div className="meta">
              {idea.authorName} · {idea.supportIds.length} 人支持
            </div>
            <h3>{idea.title}</h3>
            <p className="muted">{idea.body.slice(0, 72)}…</p>
          </Link>
        ))}
      </div>

      <div className="section-head">
        <h2>可接的开发任务</h2>
        <Link to="/tasks">需求广场 →</Link>
      </div>
      <div className="grid">
        {store.tasks
          .filter((t) => t.status === "open")
          .map((t) => (
            <Link className="card" key={t.id} to={`/tasks/${t.id}`}>
              <div className="meta">
                {formatMoney(t.budget)} · {t.days} 天工期
              </div>
              <h3>{t.title}</h3>
              <p className="muted">{t.description.slice(0, 80)}…</p>
            </Link>
          ))}
      </div>
    </>
  );
}

export function hue(h: number) {
  return `linear-gradient(135deg, hsl(${h} 42% 38%), hsl(${(h + 28) % 360} 48% 28%))`;
}
