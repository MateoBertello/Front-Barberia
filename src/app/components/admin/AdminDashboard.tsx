import React, { useState } from "react";
import { Calendar, TrendingUp, Users, DollarSign, CheckCircle, XCircle, AlertCircle, Clock, Search } from "lucide-react";
import { GOLD, GOLD_LIGHT, GOLD_DIM, SURFACE, SURFACE2, BORDER, BORDER2 } from "../../constants";

const stats = [
  { label: "Turnos hoy", value: "8", sub: "+2 vs ayer", icon: Calendar, color: "#818CF8" },
  { label: "Ingresos del día", value: "$28.700", sub: "+12% esta semana", icon: DollarSign, color: GOLD },
  { label: "Clientes activos", value: "412", sub: "Este mes", icon: Users, color: "#34D399" },
  { label: "Tasa de asistencia", value: "94.2%", sub: "+2.1% vs semana pasada", icon: TrendingUp, color: "#F472B6" },
];

const appointments = [
  { id: 1, time: "09:00", client: "Lucas Fernández", barber: "Miguel Ángel", service: "Fade Premium", status: "completado", price: 3200 },
  { id: 2, time: "09:30", client: "Nicolás Gómez", barber: "Rodrigo Sosa", service: "Corte Clásico", status: "en curso", price: 2500 },
  { id: 3, time: "10:30", client: "Agustín Torres", barber: "Miguel Ángel", service: "Corte + Barba", status: "pendiente", price: 4500 },
  { id: 4, time: "11:00", client: "Julián Castro", barber: "Rodrigo Sosa", service: "Barba Completa", status: "pendiente", price: 1800 },
  { id: 5, time: "11:30", client: "Matías López", barber: "Miguel Ángel", service: "Fade Premium", status: "cancelado", price: 3200 },
  { id: 6, time: "12:00", client: "Diego Muñoz", barber: "Rodrigo Sosa", service: "Corte Clásico", status: "pendiente", price: 2500 },
  { id: 7, time: "14:00", client: "Pablo Ruiz", barber: "Miguel Ángel", service: "Color & Decoloración", status: "pendiente", price: 6500 },
  { id: 8, time: "15:00", client: "Carlos Vera", barber: "Rodrigo Sosa", service: "Corte + Barba", status: "pendiente", price: 4500 },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  completado: { label: "Completado", color: "#4ADE80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  "en curso": { label: "En curso", color: GOLD_LIGHT, bg: GOLD_DIM, border: `rgba(201,168,76,0.3)`, icon: <Clock className="w-3.5 h-3.5" /> },
  pendiente: { label: "Pendiente", color: "#94A3B8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)", icon: <AlertCircle className="w-3.5 h-3.5" /> },
  cancelado: { label: "Cancelado", color: "#F87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)", icon: <XCircle className="w-3.5 h-3.5" /> },
};

export function AdminDashboard() {
  const [filter, setFilter] = useState<string>("todos");
  const [search, setSearch] = useState("");

  const filtered = appointments.filter((a) => {
    const matchStatus = filter === "todos" || a.status === filter;
    const matchSearch = search === "" || a.client.toLowerCase().includes(search.toLowerCase()) || a.barber.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    completado: appointments.filter((a) => a.status === "completado").length,
    "en curso": appointments.filter((a) => a.status === "en curso").length,
    pendiente: appointments.filter((a) => a.status === "pendiente").length,
    cancelado: appointments.filter((a) => a.status === "cancelado").length,
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-zinc-500 text-xs">{label}</span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
            </div>
            <div className="text-white" style={{ fontSize: "1.4rem", fontWeight: 600 }}>{value}</div>
            <div className="text-zinc-600 text-xs mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
        {/* Table header */}
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3" style={{ borderBottom: `1px solid ${BORDER2}` }}>
          <div className="flex-1">
            <h3 className="text-white text-sm font-medium">Turnos de Hoy</h3>
            <p className="text-zinc-600 text-xs mt-0.5">
              {counts.completado} completados · {counts["en curso"]} en curso · {counts.pendiente} pendientes · {counts.cancelado} cancelados
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status filters */}
            {(["todos", "en curso", "pendiente", "completado", "cancelado"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1 rounded-full text-xs capitalize transition-all"
                style={
                  filter === f
                    ? { background: GOLD_DIM, color: GOLD_LIGHT, border: `1px solid ${GOLD}` }
                    : { background: SURFACE2, color: "#666", border: `1px solid ${BORDER}` }
                }
              >
                {f === "todos" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
              <Search className="w-3 h-3 text-zinc-600" />
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-zinc-300 placeholder-zinc-700 outline-none w-24"
              />
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid #131313` }}>
                {["Hora", "Cliente", "Barbero", "Servicio", "Precio", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-zinc-700 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt, i) => {
                const sc = statusConfig[appt.status];
                return (
                  <tr
                    key={appt.id}
                    className="transition-colors"
                    style={{ borderBottom: i < filtered.length - 1 ? `1px solid #111` : "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#181818")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium" style={{ color: GOLD_LIGHT }}>{appt.time}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background: "#222", color: "#888" }}>
                          {appt.client.charAt(0)}
                        </div>
                        <span className="text-zinc-200 text-sm">{appt.client}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400 text-sm">{appt.barber}</td>
                    <td className="px-5 py-3.5 text-zinc-400 text-sm">{appt.service}</td>
                    <td className="px-5 py-3.5 text-zinc-300 text-sm">${appt.price.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        {sc.icon}
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button className="px-2.5 py-1 rounded-md text-xs" style={{ background: SURFACE2, color: "#888", border: `1px solid ${BORDER}` }}>Ver</button>
                        {appt.status === "pendiente" && (
                          <>
                            <button className="px-2.5 py-1 rounded-md text-xs" style={{ background: "rgba(74,222,128,0.08)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.2)" }}>✓</button>
                            <button className="px-2.5 py-1 rounded-md text-xs" style={{ background: "rgba(248,113,113,0.08)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}>✕</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="md:hidden">
          {filtered.map((appt, i) => {
            const sc = statusConfig[appt.status];
            return (
              <div key={appt.id} className="px-4 py-4" style={{ borderBottom: i < filtered.length - 1 ? `1px solid #131313` : "none" }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ background: "#222", color: "#888" }}>
                      {appt.client.charAt(0)}
                    </div>
                    <div>
                      <div className="text-zinc-200 text-sm">{appt.client}</div>
                      <div className="text-zinc-600 text-xs">{appt.barber}</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: sc.bg, color: sc.color }}>
                    {sc.icon}{sc.label}
                  </span>
                </div>
                <div className="flex items-center justify-between ml-12">
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: GOLD_LIGHT }}>{appt.time}</span>
                    <span className="text-zinc-500 text-xs">{appt.service}</span>
                  </div>
                  <span className="text-zinc-300 text-sm">${appt.price.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-zinc-600 text-sm">No se encontraron turnos.</div>
        )}
      </div>
    </div>
  );
}
