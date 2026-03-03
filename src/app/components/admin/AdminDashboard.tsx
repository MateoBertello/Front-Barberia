import React, { useState, useEffect } from "react";
import { apiClient } from "../utils/apsClient";
import { GOLD_LIGHT } from "../../constants";

export function AdminDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    apiClient<any[]>("/turnos")
      .then(data => setAppointments(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-white text-3xl font-bold mb-6">Panel de Control</h1>
      <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
        <table className="w-full">
          <thead className="bg-zinc-950/50">
            <tr>
              {["Hora", "Cliente", "Barbero", "Servicio", "Precio", "Estado"].map(h => <th key={h} className="px-5 py-3 text-left text-xs text-zinc-500 uppercase">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {appointments.map((t) => (
              <tr key={t.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                 <td className="px-5 py-4 text-sm font-medium" style={{ color: GOLD_LIGHT }}>{new Date(t.fechaHoraInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                 <td className="px-5 py-4 text-zinc-200 text-sm">{t.cliente.nombre}</td>
                 <td className="px-5 py-4 text-zinc-400 text-sm">{t.barbero.nombre}</td>
                 <td className="px-5 py-4 text-zinc-400 text-sm">{t.servicio.nombre}</td>
                 <td className="px-5 py-4 text-zinc-300 text-sm">${t.servicio.precio}</td>
                 <td className="px-5 py-4"><span className="px-2 py-1 rounded text-xs bg-zinc-800 text-zinc-300">{t.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && <div className="p-8 text-center text-zinc-500">No hay turnos registrados.</div>}
      </div>
    </div>
  );
}