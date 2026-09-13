import { NavLink, Outlet } from "react-router-dom";
import { currentUser, loginAs, useStore } from "../store";

const links = [
  { to: "/", label: "首页", end: true },
  { to: "/miniapps", label: "小程序馆" },
  { to: "/ideas", label: "灵感墙" },
  { to: "/tasks", label: "需求广场" },
  { to: "/publish", label: "发布" },
  { to: "/me", label: "我的" },
];

export default function Layout() {
  const store = useStore();
  const me = currentUser(store);

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand">
            <span className="brand-mark">微</span>
            微集
          </NavLink>
          <nav className="nav">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "active" : "")}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="user-switch">
            <select
              value={store.currentUserId ?? ""}
              onChange={(e) => loginAs(e.target.value)}
              aria-label="切换当前用户"
            >
              {store.users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} · {roleLabel(u.role)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-inner">
          微集 · 收录小程序、沉淀灵感、对接有预算的开发任务。当前身份：{me?.name ?? "未登录"}
        </div>
      </footer>
    </div>
  );
}

function roleLabel(role: string) {
  if (role === "developer") return "开发者";
  if (role === "maker") return "产品/商家";
  return "访客";
}
