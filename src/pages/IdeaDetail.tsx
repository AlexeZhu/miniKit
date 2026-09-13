import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addComment, currentUser, formatDate, toggleSupport, useStore } from "../store";

export default function IdeaDetail() {
  const { id } = useParams();
  const store = useStore();
  const me = currentUser(store);
  const idea = store.ideas.find((i) => i.id === id);
  const comments = store.comments.filter((c) => c.ideaId === id);
  const [body, setBody] = useState("");
  const [err, setErr] = useState("");

  if (!idea) {
    return (
      <div className="empty panel">
        灵感不存在。<Link to="/ideas">返回</Link>
      </div>
    );
  }

  const on = me ? idea.supportIds.includes(me.id) : false;

  function onComment(e: FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      addComment(id!, body.trim());
      setBody("");
    } catch (error) {
      setErr((error as Error).message);
    }
  }

  return (
    <div className="detail">
      <article className="panel stack">
        <div className="meta">
          {idea.authorName} · {formatDate(idea.createdAt)}
        </div>
        <h1>{idea.title}</h1>
        <p className="idea-body">{idea.body}</p>
        <div className="tags">
          {idea.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <button
          className={`support ${on ? "on" : ""}`}
          onClick={() => {
            try {
              toggleSupport(idea.id);
            } catch (e) {
              setErr((e as Error).message);
            }
          }}
        >
          {on ? "已支持" : "支持这个点子"} · {idea.supportIds.length}
        </button>
      </article>
      <aside className="panel stack">
        <h3>评论 {comments.length}</h3>
        {comments.map((c) => (
          <div className="comment" key={c.id}>
            <div className="meta">
              {c.authorName} · {formatDate(c.createdAt)}
            </div>
            <div>{c.body}</div>
          </div>
        ))}
        <form className="stack" onSubmit={onComment}>
          <textarea
            rows={4}
            placeholder="补充场景、泼冷水、或愿意一起做…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            minLength={2}
          />
          {err ? <div className="notice">{err}</div> : null}
          <button className="btn" type="submit">
            发表评论
          </button>
        </form>
      </aside>
    </div>
  );
}
