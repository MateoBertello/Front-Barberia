import React, { useState, useEffect } from "react";
import { Calendar, TrendingUp, Users, DollarSign, CheckCircle, XCircle, AlertCircle, Clock, Search } from "lucide-react";
import { GOLD, GOLD_LIGHT, GOLD_DIM, SURFACE, SURFACE2, BORDER, BORDER2 } from "../../constants";

export function AdminDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("todos");
  const [search, setSearch] = useState("");

  // --- OBTENER TURNOS DESDE JAVA ---
  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/turnos");
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (error) {
        console.error("Error al cargar turnos", error);
      }
    };
    fetchTurnos();
  }, []);

  const filtered = appointments.filter((a) => {
    const matchStatus = filter === "todos" || a.estado.toLowerCase() === filter.toLowerCase();
    const matchSearch = search === "" || a.cliente.nombre.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalIngresos = appointments.reduce((sum, t) => sum + t.servicio.precio, 0);

  return (
    <div className="p-4 lg:p-6">
      {/* Stats Generados con Datos Reales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
          <div className="text-zinc-500 text-xs mb-1">Turnos Totales</div>
          <div className="text-white text-2xl font-bold">{appointments.length}</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
          <div className="text-zinc-500 text-xs mb-1">Ingresos Estimados</div>
          <div className="text-gold text-2xl font-bold" style={{ color: GOLD }}>${totalIngresos}</div>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800">
          <h3 className="text-white text-sm font-medium">Historial de Turnos</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-800 bg-zinc-900/50">
              <tr>
                {["Fecha y Hora", "Cliente", "Barbero", "Servicio", "Precio", "Estado"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-zinc-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt, i) => {
                // Formateamos la fecha que viene de Java (ej: "2026-02-24T10:30:00")
                const fecha = new Date(appt.fechaHoraInicio);
                const fechaStr = fecha.toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

                return (
                  <tr key={appt.id} className="border-b border-zinc-800 hover:bg-zinc-800/30">
                    <td className="px-5 py-4 text-sm font-medium" style={{ color: GOLD_LIGHT }}>{fechaStr} hs</td>
                    <td className="px-5 py-4 text-zinc-200 text-sm">{appt.cliente.nombre}</td>
                    <td className="px-5 py-4 text-zinc-400 text-sm">{appt.barbero.nombre}</td>
                    <td className="px-5 py-4 text-zinc-400 text-sm">{appt.servicio.nombre}</td>
                    <td className="px-5 py-4 text-zinc-300 text-sm">${appt.servicio.precio}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {appt.estado}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-12 text-center text-zinc-600 text-sm">No hay turnos registrados aún.</div>}
        </div>
      </div>
    </div>
  );
}