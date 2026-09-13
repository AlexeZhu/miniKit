import { Link } from "react-router-dom";
import { currentUser, formatDate, toggleSupport, useStore } from "../store";

export default function Ideas() {
  const store = useStore();
  const me = currentUser(store);

  return (
    <>
      <div className="kicker">IDEAS</div>
      <h1>灵感墙</h1>
      <p className="lead">抛出一个还没做成产品的点子。别人可以支持，也可以把坑和补丁写在评论里。</p>
      <div className="toolbar">
        <Link className="btn" to="/publish?tab=idea">
          写下灵感
        </Link>
      </div>
      <div className="stack">
        {store.ideas.map((idea) => {
          const comments = store.comments.filter((c) => c.ideaId === idea.id).length;
          const on = me ? idea.supportIds.includes(me.id) : false;
          return (
            <article className="panel" key={idea.id}>
              <div className="meta">
                {idea.authorName} · {formatDate(idea.createdAt)}
              </div>
              <h3>
                <Link to={`/ideas/${idea.id}`}>{idea.title}</Link>
              </h3>
              <p>{idea.body}</p>
              <div className="tags">
                {idea.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="hero-actions">
                <button
                  className={`support ${on ? "on" : ""}`}
                  onClick={() => {
                    try {
                      toggleSupport(idea.id);
                    } catch (e) {
                      alert((e as Error).message);
                    }
                  }}
                >
                  {on ? "已支持" : "支持"} · {idea.supportIds.length}
                </button>
                <Link className="btn secondary" to={`/ideas/${idea.id}`}>
                  {comments} 条评论
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
