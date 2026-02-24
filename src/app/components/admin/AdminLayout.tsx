import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  Scissors, LayoutDashboard, Calendar, Users, Star, MapPin, Settings, Menu, X, LogOut, ChevronRight, Bell,
} from "lucide-react";
import { GOLD, GOLD_LIGHT, GOLD_DIM, FONT_BODY, BORDER, BORDER2, SURFACE } from "../../constants";

const navItems = [
  { icon: LayoutDashboard, label: "Turnos de Hoy", path: "/admin" },
  { icon: MapPin, label: "Sucursales", path: "/admin/branches" },
  { icon: Star, label: "Servicios", path: "/admin/services" },
  { icon: Users, label: "Staff / Barberos", path: "/admin/staff" },
  { icon: Calendar, label: "Horarios", path: "/admin/schedules" },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: FONT_BODY }}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: `1px solid ${BORDER2}` }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: GOLD }}>
            <Scissors className="w-4 h-4 text-black" />
          </div>
          <div>
            <div className="text-white text-sm" style={{ letterSpacing: "0.1em" }}>
              Barber<span style={{ color: GOLD }}>SaaS</span>
            </div>
            <div className="text-zinc-600 text-xs">Panel Admin</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400 lg:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Branch selector */}
      <div className="px-4 py-3">
        <button
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left"
          style={{ background: "#111", border: `1px solid ${BORDER}` }}
        >
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#4ADE80" }} />
          <span className="text-zinc-400 text-xs flex-1 truncate">BarberSaaS – Centro</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-700" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-zinc-700 text-xs px-3 py-1.5 uppercase tracking-wider">Menú principal</p>
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => { navigate(path); onClose?.(); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-all text-sm"
              style={{
                background: active ? GOLD_DIM : "transparent",
                color: active ? GOLD_LIGHT : "#666",
                borderLeft: `3px solid ${active ? GOLD : "transparent"}`,
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#999"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "#666"; }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          );
        })}
        <p className="text-zinc-700 text-xs px-3 py-1.5 uppercase tracking-wider mt-3">Sistema</p>
        <button
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-all text-sm text-zinc-600 hover:text-zinc-400"
          style={{ borderLeft: "3px solid transparent" }}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          Configuración
        </button>
      </nav>

      {/* User */}
      <div className="px-4 py-4" style={{ borderTop: `1px solid ${BORDER2}` }}>
        <div className="flex items-center gap-3 mb-3 px-1">
          <img
            src="https://images.unsplash.com/photo-1635301304768-5f2db6a5499b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100"
            alt="owner"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            style={{ border: `1px solid ${GOLD}` }}
          />
          <div className="min-w-0">
            <div className="text-zinc-300 text-xs truncate">Carlos Medina</div>
            <div className="text-zinc-700 text-xs">Propietario</div>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          style={{ background: "#111", border: `1px solid ${BORDER}` }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentPage = navItems.find((n) => {
    if (n.path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(n.path);
  });

  return (
    <div className="min-h-screen flex" style={{ background: "#0A0A0A", fontFamily: FONT_BODY }}>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen"
        style={{ width: "240px", background: "#0D0D0D", borderRight: `1px solid ${BORDER2}` }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer ── */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: "rgba(0,0,0,0.75)" }}
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="fixed top-0 left-0 h-full z-50 lg:hidden"
            style={{ width: "240px", background: "#0D0D0D", borderRight: `1px solid ${BORDER2}` }}
          >
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="flex items-center gap-3 px-4 lg:px-6 h-14 flex-shrink-0 sticky top-0 z-30"
          style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER2}` }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-zinc-500 hover:text-zinc-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <span className="text-white text-sm font-medium">{currentPage?.label || "Dashboard"}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-600 text-xs hidden sm:block">
            Lun, 23 Feb 2026
          </div>
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "#161616", border: `1px solid ${BORDER}` }}>
            <Bell className="w-3.5 h-3.5 text-zinc-500" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
