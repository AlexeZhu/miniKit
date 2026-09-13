import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import MiniApps from "./pages/MiniApps";
import MiniAppDetail from "./pages/MiniAppDetail";
import Ideas from "./pages/Ideas";
import IdeaDetail from "./pages/IdeaDetail";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import Publish from "./pages/Publish";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/miniapps" element={<MiniApps />} />
        <Route path="/miniapps/:id" element={<MiniAppDetail />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="/ideas/:id" element={<IdeaDetail />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/publish" element={<Publish />} />
        <Route path="/me" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
