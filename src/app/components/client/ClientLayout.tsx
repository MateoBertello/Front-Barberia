import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Scissors, Bell, ChevronDown, Calendar, LogOut, User, Menu, X } from "lucide-react";
import { GOLD, GOLD_DIM, FONT_BODY, BORDER } from "../../constants";

const navLinks = [
  { label: "Mi Perfil", path: "/client" },
  { label: "Mis Reservas", path: "/client" },
];

export function ClientLayout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", fontFamily: FONT_BODY }}>
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-40 flex items-center gap-4 px-4 lg:px-8 h-16"
        style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${BORDER}` }}
      >
        {/* Logo */}
        <button onClick={() => navigate("/client")} className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: GOLD }}>
            <Scissors className="w-4 h-4 text-black" />
          </div>
          <span className="text-white text-sm hidden sm:block" style={{ letterSpacing: "0.15em" }}>
            Barber<span style={{ color: GOLD }}>SaaS</span>
          </span>
        </button>

        <div className="flex-1" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => navigate("/client")}
            className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Mi Perfil
          </button>
        </nav>

        {/* Nueva Reserva CTA */}
        <button
          onClick={() => navigate("/client/booking")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all hidden sm:flex"
          style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}
        >
          <Calendar className="w-3.5 h-3.5" />
          Nueva Reserva
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg" style={{ background: "#161616", border: `1px solid ${BORDER}` }}>
          <Bell className="w-4 h-4 text-zinc-500" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
        </button>

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => setUserDropdown(!userDropdown)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg transition-colors"
            style={{ background: userDropdown ? "#1A1A1A" : "transparent" }}
          >
            <img
              src="https://images.unsplash.com/photo-1758598305593-7c12d15687be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100"
              alt="user"
              className="w-7 h-7 rounded-full object-cover"
              style={{ border: `1px solid ${GOLD}` }}
            />
            <span className="text-zinc-300 text-xs hidden sm:block">Lucas F.</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-600 hidden sm:block" />
          </button>

          {userDropdown && (
            <div
              className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden z-50"
              style={{ background: "#141414", border: `1px solid ${BORDER}` }}
            >
              <div className="px-4 py-3" style={{ borderBottom: `1px solid #1E1E1E` }}>
                <div className="text-white text-xs font-medium">Lucas Fernández</div>
                <div className="text-zinc-600 text-xs">lucas@email.com</div>
              </div>
              <div className="py-1">
                <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-zinc-400 hover:text-zinc-200 text-xs text-left transition-colors">
                  <User className="w-3.5 h-3.5" />
                  Mi Cuenta
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-zinc-400 hover:text-zinc-200 text-xs text-left transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-zinc-500 hover:text-zinc-300">
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-4 py-3 flex flex-col gap-2"
          style={{ background: "#0D0D0D", borderBottom: `1px solid ${BORDER}` }}
        >
          <button
            onClick={() => { navigate("/client/booking"); setMenuOpen(false); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-left"
            style={{ background: GOLD_DIM, border: `1px solid ${GOLD}`, color: GOLD }}
          >
            <Calendar className="w-4 h-4" />
            Nueva Reserva
          </button>
        </div>
      )}

      {/* ── Page content ── */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
