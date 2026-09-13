export type User = {
  id: string;
  name: string;
  role: "visitor" | "maker" | "developer";
  bio: string;
  createdAt: string;
};

export type MiniApp = {
  id: string;
  name: string;
  appId: string;
  category: string;
  summary: string;
  description: string;
  tags: string[];
  author: string;
  ownerId: string;
  coverHue: number;
  views: number;
  featured: boolean;
  createdAt: string;
};

export type Idea = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  authorId: string;
  authorName: string;
  supportIds: string[];
  createdAt: string;
};

export type Comment = {
  id: string;
  ideaId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type TaskStatus = "open" | "in_progress" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  budget: number;
  days: number;
  skills: string[];
  authorId: string;
  authorName: string;
  status: TaskStatus;
  assigneeId?: string;
  assigneeName?: string;
  createdAt: string;
};

export type Application = {
  id: string;
  taskId: string;
  developerId: string;
  developerName: string;
  pitch: string;
  days: number;
  createdAt: string;
};

export type StoreState = {
  users: User[];
  currentUserId: string | null;
  miniApps: MiniApp[];
  ideas: Idea[];
  comments: Comment[];
  tasks: Task[];
  applications: Application[];
};
