import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  FolderKanban,
  LogOut,
  Menu,
  ShieldCheck,
  UserCircle,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function getNavItems(role) {
  const common = [
    {
      label: "Projects",
      to: "/projects",
      icon: FolderKanban,
    },
    {
      label: "Tasks",
      to: "/tasks",
      icon: ClipboardList,
    },
  ];
  const profileItem = {
    label: "Profile",
    to: "/profile",
    icon: UserCircle,
  };

  if (role === "ADMIN") {
    return [
      {
        label: "Dashboard",
        to: "/dashboard/admin",
        icon: BarChart3,
      },
      ...common,
      {
        label: "Users",
        to: "/users",
        icon: Users,
      },
      profileItem,
    ];
  }

  if (role === "ANNOTATOR") {
    return [
      {
        label: "Dashboard",
        to: "/dashboard/annotator",
        icon: BarChart3,
      },
      {
        label: "My Tasks",
        to: "/tasks",
        icon: ClipboardList,
      },
      profileItem,
    ];
  }

  if (role === "REVIEWER") {
    return [
      {
        label: "Dashboard",
        to: "/dashboard/reviewer",
        icon: BarChart3,
      },
      {
        label: "Review Queue",
        to: "/evaluations/review",
        icon: ShieldCheck,
      },
      ...common,
      profileItem,
    ];
  }

  return [...common, profileItem];
}

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = getNavItems(user?.role);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const sidebarContent = (
    <>
      <Link to="/" className="flex items-center gap-2 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
          AI
        </div>
        <div>
          <p className="font-bold text-slate-950">EvalFlow AI</p>
          <p className="text-xs text-slate-500">LLM Evaluation Ops</p>
        </div>
      </Link>

      <nav className="mt-8 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white px-4 py-5 lg:block">
        {sidebarContent}
      </aside>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <aside className="absolute inset-y-0 left-0 w-72 border-r border-slate-200 bg-white px-4 py-5 shadow-xl">
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950"
              >
                <X size={20} />
              </button>
            </div>

            {sidebarContent}
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-sm text-slate-500">Welcome back</p>
                <h1 className="font-semibold text-slate-950">{user?.name}</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-950">{user?.email}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
