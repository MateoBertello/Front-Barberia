import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Scissors, User, ShieldCheck } from "lucide-react";
import { GOLD, GOLD_LIGHT, GOLD_DIM, FONT_BODY, FONT_DISPLAY, SURFACE, SURFACE2, BORDER } from "../../constants";

type Role = "client" | "admin";
type AuthMode = "login" | "register";

export function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("client");
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "client") navigate("/client");
    else navigate("/admin");
  };

  const inputStyle: React.CSSProperties = {
    background: SURFACE2,
    border: `1px solid ${BORDER}`,
    color: "#F0EFE9",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = GOLD;
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = BORDER;
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: FONT_BODY, background: "#0A0A0A" }}>
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1759134198561-e2041049419c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080')` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(150deg,rgba(10,10,10,0.88) 0%,rgba(10,10,10,0.50) 60%,rgba(201,168,76,0.08) 100%)" }}
        />
        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GOLD }}>
            <Scissors className="w-5 h-5 text-black" />
          </div>
          <span className="text-white text-sm tracking-widest uppercase" style={{ letterSpacing: "0.22em" }}>
            Barber<span style={{ color: GOLD }}>SaaS</span>
          </span>
        </div>
        {/* Tagline */}
        <div className="relative">
          <div className="w-10 h-px mb-6" style={{ background: GOLD }} />
          <h1
            className="text-white mb-4"
            style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 500, lineHeight: 1.2 }}
          >
            La plataforma premium para barberías modernas
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
            Gestión de reservas, personal, sucursales y servicios — todo en un ecosistema elegante.
          </p>
          <div className="flex items-center gap-8 mt-8">
            {[["2,400+", "Turnos / mes"], ["150+", "Barberías activas"], ["Multi", "Sucursal"]].map(([v, l]) => (
              <div key={l}>
                <div className="text-sm" style={{ color: GOLD_LIGHT }}>{v}</div>
                <div className="text-zinc-600 text-xs">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-14" style={{ background: "#0D0D0D" }}>
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: GOLD }}>
              <Scissors className="w-4 h-4 text-black" />
            </div>
            <span className="text-white text-sm" style={{ letterSpacing: "0.18em" }}>
              Barber<span style={{ color: GOLD }}>SaaS</span>
            </span>
          </div>

          {/* Role selector */}
          <div className="flex gap-3 mb-8">
            {([["client", "Soy Cliente", User], ["admin", "Soy Administrador", ShieldCheck]] as const).map(
              ([r, label, Icon]) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setMode("login"); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm transition-all duration-200"
                  style={{
                    background: role === r ? GOLD_DIM : SURFACE,
                    border: `1.5px solid ${role === r ? GOLD : BORDER}`,
                    color: role === r ? GOLD_LIGHT : "#666",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              )
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-white mb-1" style={{ fontFamily: FONT_DISPLAY, fontSize: "2rem", fontWeight: 500 }}>
              {mode === "login" ? "Bienvenido de nuevo" : "Crear cuenta"}
            </h2>
            <p className="text-zinc-500 text-sm">
              {mode === "login"
                ? role === "client"
                  ? "Iniciá sesión para ver tus turnos."
                  : "Accedé al panel de administración."
                : "Completá el formulario para comenzar."}
            </p>
          </div>

          {/* Mode tabs */}
          {role === "client" && (
            <div className="flex rounded-lg p-1 mb-6" style={{ background: "#111", border: `1px solid ${BORDER}` }}>
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="flex-1 py-2 rounded-md text-xs transition-all"
                  style={{
                    background: mode === m ? SURFACE2 : "transparent",
                    color: mode === m ? "#F0EFE9" : "#555",
                    borderBottom: mode === m ? `2px solid ${GOLD}` : "2px solid transparent",
                  }}
                >
                  {m === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Register-only fields */}
            {mode === "register" && role === "client" && (
              <>
                <div>
                  <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">Nombre completo</label>
                  <input
                    type="text"
                    placeholder="Ej. Lucas Fernández"
                    className="w-full rounded-lg px-4 py-3 text-sm placeholder-zinc-700 outline-none transition-colors"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="+54 9 11 1234-5678"
                    className="w-full rounded-lg px-4 py-3 text-sm placeholder-zinc-700 outline-none transition-colors"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full rounded-lg px-4 py-3 text-sm placeholder-zinc-700 outline-none transition-colors"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div>
              <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-lg px-4 py-3 pr-11 text-sm placeholder-zinc-700 outline-none transition-colors"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="flex justify-end">
                <button type="button" className="text-xs transition-colors" style={{ color: GOLD }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl py-3 text-sm font-medium mt-1 transition-all"
              style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {mode === "login"
                ? role === "client"
                  ? "Ingresar como Cliente"
                  : "Acceder al Panel Admin"
                : "Crear mi Cuenta"}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: BORDER }} />
              <span className="text-zinc-700 text-xs">acceso rápido</span>
              <div className="flex-1 h-px" style={{ background: BORDER }} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigate("/client")}
                className="py-2.5 rounded-lg text-xs transition-all"
                style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "#777" }}
              >
                Demo Cliente →
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="py-2.5 rounded-lg text-xs transition-all"
                style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "#777" }}
              >
                Demo Admin →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
