import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { apiClient } from "../utils/apsClient"; 
import { GOLD, GOLD_LIGHT, SURFACE, BORDER2 } from "../../constants";

export function BarberDashboard() {
  const [misTurnos, setMisTurnos] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        // apiClient ya devuelve los datos parseados
        const data = await apiClient<any[]>("/turnos");
        
        const soloMisTurnos = data.filter((t: any) => t.barbero.id === Number(userId));
        
        soloMisTurnos.sort((a: any, b: any) => new Date(a.fechaHoraInicio).getTime() - new Date(b.fechaHoraInicio).getTime());
        setMisTurnos(soloMisTurnos);

      } catch (error) {
        console.error("Error al cargar turnos", error);
      }
    };
    fetchTurnos();
  }, []);

  const cambiarEstadoTurno = async (id: number, nuevoEstado: string) => {
    try {
      // Usamos successMessage para que el cliente muestre el Toast verde automáticamente
      await apiClient(`/turnos/${id}/estado`, {
        method: "PUT", 
        body: JSON.stringify({ estado: nuevoEstado }),
        successMessage: `Turno ${nuevoEstado.toLowerCase()} correctamente`
      });

      // Si no hubo error (apiClient lanza error si falla), actualizamos el estado local
      setMisTurnos(prev => prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));
      
    } catch (error) { 
       // El error ya se mostró en un toast rojo
       console.error("Error actualizando turno", error); 
    }
  };

  const turnosPendientes = misTurnos.filter(t => t.estado === "PENDIENTE").length;
  const turnosCompletados = misTurnos.filter(t => t.estado === "COMPLETADO").length;

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-white text-2xl font-medium mb-1">Mi Agenda</h1>
        <p className="text-zinc-500 text-sm">Gestioná tus cortes programados para hoy.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
          <div className="text-zinc-500 text-xs mb-1 uppercase tracking-wider">Pendientes</div>
          <div className="text-white text-3xl font-bold">{turnosPendientes}</div>
        </div>
        <div className="rounded-xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
          <div className="text-zinc-500 text-xs mb-1 uppercase tracking-wider">Completados</div>
          <div className="text-3xl font-bold" style={{ color: GOLD }}>{turnosCompletados}</div>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
        <div className="px-5 py-4 border-b border-zinc-800"><h3 className="text-white text-sm font-medium">Próximos Turnos</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-900/50">
              <tr>
                {["Hora", "Cliente", "Servicio", "Sucursal", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-zinc-500 uppercase font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {misTurnos.map((t) => {
                const fecha = new Date(t.fechaHoraInicio);
                const fechaStr = fecha.toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

                return (
                  <tr key={t.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                    <td className="px-5 py-4 text-sm font-medium" style={{ color: GOLD_LIGHT }}>{fechaStr} hs</td>
                    <td className="px-5 py-4 text-zinc-200 text-sm">{t.cliente.nombre}</td>
                    <td className="px-5 py-4 text-zinc-400 text-sm">{t.servicio.nombre}</td>
                    <td className="px-5 py-4 text-zinc-500 text-xs">{t.sucursal.nombre}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs bg-zinc-800 text-zinc-300 border border-zinc-700">{t.estado}</span>
                    </td>
                    <td className="px-5 py-4">
                      {t.estado === "PENDIENTE" ? (
                        <div className="flex gap-2">
                          <button onClick={() => cambiarEstadoTurno(t.id, "COMPLETADO")} className="p-1.5 rounded-md text-green-400 hover:bg-green-400/10 border border-green-400/20 transition-colors" title="Marcar como Completado"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => cambiarEstadoTurno(t.id, "CANCELADO")} className="p-1.5 rounded-md text-red-400 hover:bg-red-400/10 border border-red-400/20 transition-colors" title="Cancelar Turno"><XCircle className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-600">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {misTurnos.length === 0 && <div className="py-12 text-center text-zinc-600 text-sm">No tienes turnos agendados.</div>}
        </div>
      </div>
    </div>
  );
}