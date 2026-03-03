import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Scissors, CalendarDays, LogOut, Menu, X, Bell } from "lucide-react";
import { GOLD, GOLD_LIGHT, GOLD_DIM, FONT_BODY, BORDER, BORDER2 } from "../../constants";

export function BarberLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ fontFamily: FONT_BODY }}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: `1px solid ${BORDER2}` }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: GOLD }}>
            <Scissors className="w-4 h-4 text-black" />
          </div>
          <div>
            <div className="text-white text-sm" style={{ letterSpacing: "0.1em" }}>Barber<span style={{ color: GOLD }}>SaaS</span></div>
            <div className="text-zinc-500 text-xs">Panel Barbero</div>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="text-zinc-600 hover:text-zinc-400 lg:hidden"><X className="w-4 h-4" /></button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <button onClick={() => { navigate("/barber"); setSidebarOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-all text-sm" style={{ background: GOLD_DIM, color: GOLD_LIGHT, borderLeft: `3px solid ${GOLD}` }}>
          <CalendarDays className="w-4 h-4 flex-shrink-0" /> Mi Agenda
        </button>
      </nav>

      {/* User */}
      <div className="px-4 py-4" style={{ borderTop: `1px solid ${BORDER2}` }}>
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border" style={{ borderColor: GOLD }}>
            <Scissors className="w-4 h-4 text-gold" style={{ color: GOLD }} />
          </div>
          <div className="min-w-0">
            <div className="text-zinc-300 text-xs truncate">Mi Perfil</div>
            <div className="text-zinc-500 text-xs">Staff</div>
          </div>
        </div>
        <button onClick={() => navigate("/")} className="flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left text-xs text-zinc-600 hover:text-zinc-400 transition-colors" style={{ background: "#111", border: `1px solid ${BORDER}` }}>
          <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "#0A0A0A", fontFamily: FONT_BODY }}>
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen" style={{ width: "240px", background: "#0D0D0D", borderRight: `1px solid ${BORDER2}` }}>
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 lg:hidden" style={{ background: "rgba(0,0,0,0.75)" }} onClick={() => setSidebarOpen(false)} />
          <aside className="fixed top-0 left-0 h-full z-50 lg:hidden" style={{ width: "240px", background: "#0D0D0D", borderRight: `1px solid ${BORDER2}` }}><SidebarContent /></aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 px-4 lg:px-6 h-14 flex-shrink-0 sticky top-0 z-30" style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER2}` }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-zinc-500 hover:text-zinc-300"><Menu className="w-5 h-5" /></button>
          <div className="flex-1"><span className="text-white text-sm font-medium">Panel de Control</span></div>
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  );
}