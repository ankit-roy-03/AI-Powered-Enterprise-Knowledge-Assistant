import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Database,
  BarChart3,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>AI Knowledge</h2>

      <nav>
        <NavLink to="/" className="menu-item">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/chat" className="menu-item">
          <MessageSquare size={20} />
          <span>AI Chat</span>
        </NavLink>

        <NavLink to="/documents" className="menu-item">
          <FileText size={20} />
          <span>Documents</span>
        </NavLink>

        <NavLink to="/knowledge-base" className="menu-item">
          <Database size={20} />
          <span>Knowledge Base</span>
        </NavLink>

        <NavLink to="/analytics" className="menu-item">
          <BarChart3 size={20} />
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/settings" className="menu-item">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;