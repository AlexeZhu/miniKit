import { useEffect, useState } from "react";
import { seedState, uid, now } from "./seed";
import type {
  Application,
  Comment,
  Idea,
  MiniApp,
  StoreState,
  Task,
  TaskStatus,
  User,
} from "./types";

const KEY = "weiji-store-v1";

function load(): StoreState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw) as StoreState;
    if (!parsed.users || !parsed.miniApps) return seedState();
    return parsed;
  } catch {
    return seedState();
  }
}

let state = load();
const listeners = new Set<() => void>();

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((fn) => fn());
}

export function useStore(): StoreState {
  const [, setTick] = useState(0);
  useEffect(() => {
    const fn = () => setTick((n) => n + 1);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return state;
}

export function currentUser(s: StoreState = state): User | null {
  return s.users.find((u) => u.id === s.currentUserId) ?? null;
}

export function loginAs(userId: string) {
  state = { ...state, currentUserId: userId };
  persist();
}

export function registerUser(name: string, role: User["role"], bio: string) {
  const user: User = { id: uid(), name, role, bio, createdAt: now() };
  state = { ...state, users: [...state.users, user], currentUserId: user.id };
  persist();
  return user;
}

export function addMiniApp(
  input: Omit<MiniApp, "id" | "views" | "featured" | "createdAt" | "ownerId" | "author">,
) {
  const user = currentUser();
  if (!user) throw new Error("请先登录");
  const item: MiniApp = {
    ...input,
    id: uid(),
    ownerId: user.id,
    author: user.name,
    views: 0,
    featured: false,
    createdAt: now(),
  };
  state = { ...state, miniApps: [item, ...state.miniApps] };
  persist();
  return item;
}

export function bumpMiniAppViews(id: string) {
  state = {
    ...state,
    miniApps: state.miniApps.map((m) => (m.id === id ? { ...m, views: m.views + 1 } : m)),
  };
  persist();
}

export function addIdea(title: string, body: string, tags: string[]) {
  const user = currentUser();
  if (!user) throw new Error("请先登录");
  const idea: Idea = {
    id: uid(),
    title,
    body,
    tags,
    authorId: user.id,
    authorName: user.name,
    supportIds: [],
    createdAt: now(),
  };
  state = { ...state, ideas: [idea, ...state.ideas] };
  persist();
  return idea;
}

export function toggleSupport(ideaId: string) {
  const user = currentUser();
  if (!user) throw new Error("请先登录");
  state = {
    ...state,
    ideas: state.ideas.map((idea) => {
      if (idea.id !== ideaId) return idea;
      const has = idea.supportIds.includes(user.id);
      return {
        ...idea,
        supportIds: has
          ? idea.supportIds.filter((id) => id !== user.id)
          : [...idea.supportIds, user.id],
      };
    }),
  };
  persist();
}

export function addComment(ideaId: string, body: string) {
  const user = currentUser();
  if (!user) throw new Error("请先登录");
  const comment: Comment = {
    id: uid(),
    ideaId,
    authorId: user.id,
    authorName: user.name,
    body,
    createdAt: now(),
  };
  state = { ...state, comments: [...state.comments, comment] };
  persist();
  return comment;
}

export function addTask(input: {
  title: string;
  description: string;
  budget: number;
  days: number;
  skills: string[];
}) {
  const user = currentUser();
  if (!user) throw new Error("请先登录");
  const task: Task = {
    ...input,
    id: uid(),
    authorId: user.id,
    authorName: user.name,
    status: "open",
    createdAt: now(),
  };
  state = { ...state, tasks: [task, ...state.tasks] };
  persist();
  return task;
}

export function applyTask(taskId: string, pitch: string, days: number) {
  const user = currentUser();
  if (!user) throw new Error("请先登录");
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task) throw new Error("任务不存在");
  if (task.authorId === user.id) throw new Error("不能申请自己发布的任务");
  if (task.status !== "open") throw new Error("该任务已停止招募");
  const exists = state.applications.some(
    (a) => a.taskId === taskId && a.developerId === user.id,
  );
  if (exists) throw new Error("你已经申请过了");
  const application: Application = {
    id: uid(),
    taskId,
    developerId: user.id,
    developerName: user.name,
    pitch,
    days,
    createdAt: now(),
  };
  state = { ...state, applications: [...state.applications, application] };
  persist();
  return application;
}

export function awardTask(taskId: string, developerId: string) {
  const user = currentUser();
  const task = state.tasks.find((t) => t.id === taskId);
  if (!user || !task || task.authorId !== user.id) throw new Error("只有发布者可以选定开发者");
  const app = state.applications.find(
    (a) => a.taskId === taskId && a.developerId === developerId,
  );
  if (!app) throw new Error("找不到该申请");
  state = {
    ...state,
    tasks: state.tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            status: "in_progress" as TaskStatus,
            assigneeId: app.developerId,
            assigneeName: app.developerName,
          }
        : t,
    ),
  };
  persist();
}

export function completeTask(taskId: string) {
  const user = currentUser();
  const task = state.tasks.find((t) => t.id === taskId);
  if (!user || !task || task.authorId !== user.id) throw new Error("只有发布者可以确认完成");
  state = {
    ...state,
    tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status: "done" } : t)),
  };
  persist();
}

export function resetDemo() {
  state = seedState();
  persist();
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatMoney(n: number) {
  return `¥${n.toLocaleString("zh-CN")}`;
}
