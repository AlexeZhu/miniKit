import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { currentUser, formatMoney, registerUser, resetDemo, useStore } from "../store";
import type { User } from "../types";

export default function Profile() {
  const store = useStore();
  const me = currentUser(store);
  const myApps = store.miniApps.filter((m) => m.ownerId === me?.id);
  const myIdeas = store.ideas.filter((i) => i.authorId === me?.id);
  const myTasks = store.tasks.filter((t) => t.authorId === me?.id);
  const myGigs = store.tasks.filter((t) => t.assigneeId === me?.id);
  const [msg, setMsg] = useState("");

  function onRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    registerUser(String(fd.get("name")), fd.get("role") as User["role"], String(fd.get("bio") || ""));
    setMsg("身份已创建并切换。");
    e.currentTarget.reset();
  }

  return (
    <>
      <div className="kicker">ME</div>
      <div className="profile-hero panel">
        <div>
          <h1>{me?.name}</h1>
          <p className="muted">{me?.bio || "还没有简介。"}</p>
        </div>
        <button
          className="btn secondary"
          onClick={() => {
            resetDemo();
            setMsg("已恢复演示数据。");
          }}
        >
          重置演示数据
        </button>
      </div>
      {msg ? <p className="success">{msg}</p> : null}

      <div className="section-head">
        <h2>我收录的小程序</h2>
      </div>
      <ItemList
        items={myApps.map((m) => ({ id: m.id, to: `/miniapps/${m.id}`, title: m.name, meta: m.summary }))}
        empty="还没有收录。"
      />

      <div className="section-head">
        <h2>我的灵感</h2>
      </div>
      <ItemList
        items={myIdeas.map((i) => ({
          id: i.id,
          to: `/ideas/${i.id}`,
          title: i.title,
          meta: `${i.supportIds.length} 人支持`,
        }))}
        empty="还没有发布点子。"
      />

      <div className="section-head">
        <h2>我发布的需求</h2>
      </div>
      <ItemList
        items={myTasks.map((t) => ({
          id: t.id,
          to: `/tasks/${t.id}`,
          title: t.title,
          meta: `${formatMoney(t.budget)} · ${t.days} 天`,
        }))}
        empty="还没有发布需求。"
      />

      <div className="section-head">
        <h2>我承接的开发</h2>
      </div>
      <ItemList
        items={myGigs.map((t) => ({
          id: t.id,
          to: `/tasks/${t.id}`,
          title: t.title,
          meta: t.status === "done" ? "已完成" : "进行中",
        }))}
        empty="还没有被选定的任务。"
      />

      <div className="section-head">
        <h2>登记新身份</h2>
      </div>
      <form className="panel form-grid" onSubmit={onRegister}>
        <label className="field">
          昵称
          <input name="name" required minLength={2} />
        </label>
        <label className="field">
          角色
          <select name="role" defaultValue="maker">
            <option value="maker">产品 / 商家</option>
            <option value="developer">开发者</option>
            <option value="visitor">访客</option>
          </select>
        </label>
        <label className="field full">
          简介
          <input name="bio" placeholder="你擅长什么，或你在找什么" />
        </label>
        <div className="full">
          <button className="btn">创建并切换</button>
        </div>
      </form>
    </>
  );
}

function ItemList({
  items,
  empty,
}: {
  items: { id: string; to: string; title: string; meta: string }[];
  empty: string;
}) {
  if (items.length === 0) return <div className="empty panel">{empty}</div>;
  return (
    <div className="stack">
      {items.map((it) => (
        <Link className="panel" key={it.id} to={it.to}>
          <b>{it.title}</b>
          <div className="meta">{it.meta}</div>
        </Link>
      ))}
    </div>
  );
}
