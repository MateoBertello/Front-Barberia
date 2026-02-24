import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Calendar, Clock, MapPin, Plus, Scissors } from "lucide-react";
import { GOLD, GOLD_LIGHT, GOLD_DIM, FONT_DISPLAY, SURFACE, SURFACE2, BORDER, BORDER2 } from "../../constants";

export function ClientDashboard() {
  const navigate = useNavigate();
  const [misTurnos, setMisTurnos] = useState<any[]>([]);

  useEffect(() => {
    const fetchMisTurnos = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/turnos");
        if (res.ok) {
          const data = await res.json();
          // Filtramos solo los turnos del cliente ID 1
          const turnosCliente = data.filter((t: any) => t.cliente.id === 1);
          
          // Ordenamos para que el más reciente salga arriba
          turnosCliente.sort((a: any, b: any) => new Date(b.fechaHoraInicio).getTime() - new Date(a.fechaHoraInicio).getTime());
          setMisTurnos(turnosCliente);
        }
      } catch (error) {
        console.error("Error", error);
      }
    };
    fetchMisTurnos();
  }, []);

  const totalGastado = misTurnos.reduce((sum, t) => sum + t.servicio.precio, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-zinc-500 text-sm mb-1">Hola de nuevo 👋</p>
          <h1 className="text-white" style={{ fontFamily: FONT_DISPLAY, fontSize: "2rem" }}>Mi Perfil</h1>
        </div>
        <button onClick={() => navigate("/client/booking")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: GOLD, color: "#000" }}>
          <Plus className="w-4 h-4" /> Nueva Reserva
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
          <div className="text-zinc-500 text-xs mb-1">Cortes totales</div>
          <div className="text-white text-lg font-medium">{misTurnos.length}</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
          <div className="text-zinc-500 text-xs mb-1">Total invertido</div>
          <div className="text-white text-lg font-medium">${totalGastado}</div>
        </div>
      </div>

      <section>
        <h2 className="text-white text-sm font-medium mb-4 tracking-wide border-l-2 pl-2" style={{ borderColor: GOLD }}>Mi Historial de Cortes</h2>
        <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
          {misTurnos.map((cut, i) => {
            const fecha = new Date(cut.fechaHoraInicio);
            const fechaStr = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

            return (
              <div key={cut.id} className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between hover:bg-zinc-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-800"><Scissors className="w-4 h-4 text-gold" style={{ color: GOLD }}/></div>
                  <div>
                    <div className="text-zinc-200 text-sm font-medium">{cut.servicio.nombre}</div>
                    <div className="text-zinc-500 text-xs">{fechaStr} hs · con {cut.barbero.nombre}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-zinc-300 text-sm font-medium">${cut.servicio.precio}</div>
                  <div className="text-xs text-zinc-500">{cut.sucursal.nombre}</div>
                </div>
              </div>
            );
          })}
          {misTurnos.length === 0 && <div className="py-8 text-center text-zinc-500 text-sm">Aún no tienes turnos registrados.</div>}
        </div>
      </section>
    </div>
  );
}