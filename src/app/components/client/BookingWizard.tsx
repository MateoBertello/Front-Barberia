import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Check, ChevronLeft, Calendar, Clock } from "lucide-react";
import { apiClient } from "../utils/apsClient";
import { GOLD, SURFACE, SURFACE2, BORDER } from "../../constants";

const STEP_LABELS = ["Sucursal", "Servicio", "Barbero", "Fecha & Hora", "Confirmar"];

function Progress({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-1">
      {STEP_LABELS.map((label, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all" 
                   style={{ background: done ? GOLD : active ? "transparent" : SURFACE2, border: done ? "none" : active ? `2px solid ${GOLD}` : `2px solid ${BORDER}`, color: done ? "#000" : active ? GOLD : "#444" }}>
                {done ? <Check className="w-3.5 h-3.5" /> : num}
              </div>
              <span className="text-xs whitespace-nowrap hidden sm:block" style={{ color: active ? GOLD : "#666" }}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && <div className="w-8 h-px bg-zinc-800" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function BookingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [branch, setBranch] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [barber, setBarber] = useState<any>(null);
  const [date, setDate] = useState<{ day: number; month: string } | null>(null);
  const [selTime, setSelTime] = useState("");

  const [branches, setBranches] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bData, sData] = await Promise.all([
          apiClient<any[]>("/sucursales"),
          apiClient<any[]>("/servicios")
        ]);
        setBranches(bData);
        setServices(sData);
      } catch (error) { console.error(error); }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (step === 3) {
      apiClient<any[]>("/usuarios").then(users => 
        setBarbers(users.filter(u => u.rol === "BARBERO"))
      ).catch(console.error);
    }
  }, [step]);

  const handleConfirm = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    // FECHA FICTICIA PARA EL EJEMPLO (Deberías usar un DatePicker real)
    const now = new Date();
    const [hours, minutes] = selTime.split(':');
    const fechaTurno = new Date(now.getFullYear(), now.getMonth(), date?.day || 1, parseInt(hours), parseInt(minutes));

    try {
      await apiClient("/turnos", {
        method: "POST",
        body: JSON.stringify({
           fechaHoraInicio: fechaTurno.toISOString(),
           estado: "PENDIENTE",
           cliente: { id: Number(userId) },
           barbero: { id: barber.id },
           servicio: { id: service.id },
           sucursal: { id: branch.id }
        }),
        successMessage: "¡Reserva confirmada!"
      });
      navigate("/client");
    } catch (error) { console.error(error); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-white text-2xl font-bold mb-2">Nueva Reserva</h1>
        <p className="text-zinc-500 text-sm">Configura tu experiencia.</p>
      </div>
      <Progress current={step} />

      <div className="min-h-[400px]">
        {step === 1 && branches.map(b => (
          <div key={b.id} onClick={() => { setBranch(b); setStep(2); }} className="p-4 mb-3 rounded-xl border border-zinc-800 bg-zinc-900 cursor-pointer hover:border-yellow-500">
            <h3 className="text-white font-medium">{b.nombre}</h3>
            <p className="text-zinc-500 text-sm">{b.direccion}</p>
          </div>
        ))}

        {step === 2 && services.map(s => (
          <div key={s.id} onClick={() => { setService(s); setStep(3); }} className="p-4 mb-3 rounded-xl border border-zinc-800 bg-zinc-900 cursor-pointer hover:border-yellow-500 flex justify-between">
            <div><h3 className="text-white font-medium">{s.nombre}</h3><p className="text-zinc-500 text-sm">{s.duracion} min</p></div>
            <span className="text-yellow-500">${s.precio}</span>
          </div>
        ))}

        {step === 3 && barbers.map(b => (
          <div key={b.id} onClick={() => { setBarber(b); setStep(4); }} className="p-4 mb-3 rounded-xl border border-zinc-800 bg-zinc-900 cursor-pointer hover:border-yellow-500 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white">{b.nombre.charAt(0)}</div>
             <h3 className="text-white font-medium">{b.nombre}</h3>
          </div>
        ))}

        {step === 4 && (
          <div className="text-center">
             <p className="text-zinc-400 mb-4">Elige un horario (Ejemplo)</p>
             <div className="grid grid-cols-3 gap-2">
               {["10:00", "11:30", "15:00", "17:00"].map(t => (
                 <button key={t} onClick={() => { setSelTime(t); setDate({day: 28, month: "Feb"}); setStep(5); }} className="p-2 border border-zinc-700 rounded text-white hover:border-yellow-500">{t}</button>
               ))}
             </div>
          </div>
        )}

        {step === 5 && (
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
             <h3 className="text-white text-lg mb-4">Resumen</h3>
             <div className="text-sm space-y-2 mb-6 text-zinc-400">
               <p>Sucursal: <span className="text-white">{branch?.nombre}</span></p>
               <p>Servicio: <span className="text-white">{service?.nombre}</span></p>
               <p>Barbero: <span className="text-white">{barber?.nombre}</span></p>
               <p>Hora: <span className="text-white">{selTime}</span></p>
               <p className="pt-2 border-t border-zinc-800 text-white font-bold">Total: <span className="text-yellow-500">${service?.precio}</span></p>
             </div>
             <button onClick={handleConfirm} className="w-full py-3 rounded-xl font-bold bg-yellow-600 text-black">Confirmar</button>
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-zinc-800">
        {step > 1 && <button onClick={() => setStep(s => s - 1)} className="text-zinc-500 flex items-center gap-1"><ChevronLeft className="w-4 h-4"/> Volver</button>}
        {step === 1 && <button onClick={() => navigate("/client")} className="text-zinc-500">Cancelar</button>}
      </div>
    </div>
  );
}