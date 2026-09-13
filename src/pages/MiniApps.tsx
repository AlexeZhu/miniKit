import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../seed";
import { useStore } from "../store";
import { hue } from "./Home";

export default function MiniApps() {
  const { miniApps } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("全部");

  const list = useMemo(() => {
    return miniApps.filter((m) => {
      const hit =
        !q ||
        `${m.name}${m.summary}${m.tags.join("")}${m.appId}`.toLowerCase().includes(q.toLowerCase());
      const catOk = cat === "全部" || m.category === cat;
      return hit && catOk;
    });
  }, [miniApps, q, cat]);

  return (
    <>
      <div className="kicker">CATALOG</div>
      <h1>小程序馆</h1>
      <p className="lead">浏览社区收录的微信小程序。你可以按品类筛选，或提交自己的作品。</p>
      <div className="toolbar">
        <input className="search" placeholder="搜索名称、AppId、标签" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="chips">
          {["全部", ...CATEGORIES].map((c) => (
            <button key={c} className={`chip ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
        <Link className="btn" to="/publish?tab=miniapp">
          收录小程序
        </Link>
      </div>
      {list.length === 0 ? (
        <div className="empty panel">没有符合条件的小程序。</div>
      ) : (
        <div className="grid">
          {list.map((m) => (
            <Link className="card" key={m.id} to={`/miniapps/${m.id}`}>
              <div className="cover" style={{ background: hue(m.coverHue) }}>
                {m.name.slice(0, 2)}
              </div>
              <h3>{m.name}</h3>
              <p className="muted">{m.summary}</p>
              <div className="meta">
                {m.category} · {m.views} 次浏览 · {m.author}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
