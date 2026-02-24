import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MapPin, Clock, Check, ChevronLeft, ChevronRight, Scissors, CalendarCheck, User, Star } from "lucide-react";
import { GOLD, GOLD_LIGHT, GOLD_DIM, FONT_DISPLAY, SURFACE, SURFACE2, BORDER, BORDER2 } from "../../constants";

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
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all" style={{ background: done ? GOLD : active ? "transparent" : SURFACE2, border: done ? "none" : active ? `2px solid ${GOLD}` : `2px solid ${BORDER}`, color: done ? "#000" : active ? GOLD : "#444" }}>
                {done ? <Check className="w-3.5 h-3.5" /> : num}
              </div>
              <span className="text-xs whitespace-nowrap hidden sm:block" style={{ color: active ? GOLD_LIGHT : done ? "#666" : "#333" }}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && <div className="flex-1 h-px min-w-[20px]" style={{ background: done ? GOLD : BORDER }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function SelectedBadge() {
  return <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: GOLD }}><Check className="w-3 h-3 text-black" /></div>;
}

export function BookingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);

  // Estados de datos de la Base de Datos
  const [branches, setBranches] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [turnos, setTurnos] = useState<any[]>([]);
  const [dates, setDates] = useState<any[]>([]);

  // Estados de selección del usuario
  const [selBranch, setSelBranch] = useState<number | null>(null);
  const [selService, setSelService] = useState<number | null>(null);
  const [selBarber, setSelBarber] = useState<number | null>(null);
  const [selDate, setSelDate] = useState<number | null>(null);
  const [selTime, setSelTime] = useState<string | null>(null);

  // --- CARGA INICIAL DE DATOS DESDE JAVA ---
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/sucursales").then(r => r.json()),
      fetch("http://localhost:8080/api/servicios").then(r => r.json()),
      fetch("http://localhost:8080/api/usuarios").then(r => r.json()),
      fetch("http://localhost:8080/api/turnos").then(r => r.json())
    ]).then(([sucursalesData, serviciosData, usuariosData, turnosData]) => {
      setBranches(sucursalesData.filter((s: any) => s.activa));
      setServices(serviciosData.filter((s: any) => s.activo));
      setBarbers(usuariosData.filter((u: any) => u.rol === 'BARBERO'));
      setTurnos(turnosData);
    }).catch(err => console.error("Error cargando datos:", err));

    // Generar próximos 7 días dinámicamente
    const dias = [];
    const hoy = new Date();
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      dias.push({
        fullDate: fecha.toISOString().split('T')[0], // YYYY-MM-DD
        label: fecha.toLocaleDateString('es-ES', { weekday: 'short' }),
        day: fecha.getDate(),
        month: fecha.toLocaleDateString('es-ES', { month: 'short' })
      });
    }
    setDates(dias);
  }, []);

  const branch = branches.find((b) => b.id === selBranch);
  const service = services.find((s) => s.id === selService);
  const barber = barbers.find((b) => b.id === selBarber);
  const date = selDate !== null ? dates[selDate] : null;

  // Generar horarios de 09:00 a 18:00 y bloquear los ocupados
  const timeSlots = [];
  if (date && barber) {
    for (let h = 9; h <= 18; h++) {
      for (let m of ['00', '30']) {
        const timeStr = `${h.toString().padStart(2, '0')}:${m}`;
        const dateTimeStr = `${date.fullDate}T${timeStr}:00`;
        // Verificamos si ya hay un turno para ese barbero a esa hora
        const isOcupado = turnos.some((t: any) => t.barbero.id === barber.id && t.fechaHoraInicio.startsWith(dateTimeStr));
        timeSlots.push({ time: timeStr, avail: !isOcupado });
      }
    }
  }

  const canNext = (step === 1 && selBranch !== null) || (step === 2 && selService !== null) || (step === 3 && selBarber !== null) || (step === 4 && selDate !== null && selTime !== null);

  // --- GUARDAR EL TURNO EN JAVA ---
  const handleConfirm = async () => {
    const turnoJava = {
      cliente: { id: 1 }, // Asumimos que el cliente logueado es el ID 1
      barbero: { id: barber.id },
      servicio: { id: service.id },
      sucursal: { id: branch.id },
      fechaHoraInicio: `${date.fullDate}T${selTime}:00`
    };

    try {
      const res = await fetch("http://localhost:8080/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(turnoJava)
      });

      if (res.ok) {
        setConfirmed(true);
      } else {
        const err = await res.json();
        alert("Error al reservar: " + err.error);
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="text-center max-w-sm w-full">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: GOLD_DIM, border: `2px solid ${GOLD}` }}><CalendarCheck className="w-9 h-9" style={{ color: GOLD }} /></div>
          <h2 className="text-white mb-2" style={{ fontFamily: FONT_DISPLAY, fontSize: "2.2rem", fontWeight: 500 }}>¡Turno Confirmado!</h2>
          <p className="text-zinc-400 text-sm mb-8">Te esperamos el <span style={{ color: GOLD_LIGHT }}>{date?.label} {date?.day} de {date?.month}</span> a las <span style={{ color: GOLD_LIGHT }}>{selTime}</span> hs.</p>
          <button onClick={() => navigate("/client")} className="w-full py-3 rounded-xl text-sm" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}>Volver a mi perfil</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Progress current={step} />

      {step === 1 && (
        <div>
          <h2 className="text-white mb-1" style={{ fontFamily: FONT_DISPLAY, fontSize: "1.8rem" }}>Seleccioná tu sucursal</h2>
          <p className="text-zinc-500 text-sm mb-6">Elegí la sede más conveniente para vos.</p>
          <div className="flex flex-col gap-3">
            {branches.map((b) => (
              <button key={b.id} onClick={() => setSelBranch(b.id)} className="flex items-stretch rounded-xl overflow-hidden text-left p-4" style={{ background: SURFACE, border: `1.5px solid ${selBranch === b.id ? GOLD : BORDER}` }}>
                <div className="flex-1">
                  <div className="flex justify-between"><div className="text-white font-medium">{b.nombre}</div>{selBranch === b.id && <SelectedBadge />}</div>
                  <div className="flex items-center gap-1 mt-1 text-zinc-500 text-xs"><MapPin className="w-3 h-3 text-gold" />{b.direccion}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-white mb-1" style={{ fontFamily: FONT_DISPLAY, fontSize: "1.8rem" }}>Elegí un servicio</h2>
          <div className="flex flex-col gap-3 mt-6">
            {services.map((s) => (
              <button key={s.id} onClick={() => setSelService(s.id)} className="flex items-center gap-4 p-4 rounded-xl text-left" style={{ background: SURFACE, border: `1.5px solid ${selService === s.id ? GOLD : BORDER}` }}>
                <div className="flex-1">
                  <div className="flex justify-between"><span className="text-white font-medium">{s.nombre}</span><span style={{ color: GOLD }}>${s.precio}</span></div>
                  <div className="flex items-center gap-1 mt-1"><Clock className="w-3 h-3 text-zinc-600" /><span className="text-zinc-600 text-xs">{s.duracionMinutos} min</span></div>
                </div>
                {selService === s.id && <SelectedBadge />}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-white mb-1" style={{ fontFamily: FONT_DISPLAY, fontSize: "1.8rem" }}>Seleccioná tu barbero</h2>
          <div className="grid gap-4 sm:grid-cols-3 mt-6">
            {barbers.map((b) => (
              <button key={b.id} onClick={() => setSelBarber(b.id)} className="flex flex-col items-center gap-3 p-5 rounded-xl" style={{ background: SURFACE, border: `1.5px solid ${selBarber === b.id ? GOLD : BORDER}` }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-zinc-800"><User className="text-zinc-500" /></div>
                <div className="text-center text-white text-sm font-medium">{b.nombre}</div>
                {selBarber === b.id && <SelectedBadge />}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-white mb-1" style={{ fontFamily: FONT_DISPLAY, fontSize: "1.8rem" }}>Elegí fecha y hora</h2>
          <div className="flex gap-2 mb-6 overflow-x-auto mt-6">
            {dates.map((d, i) => (
              <button key={i} onClick={() => { setSelDate(i); setSelTime(null); }} className="flex flex-col items-center px-4 py-3 rounded-xl min-w-[68px]" style={{ background: selDate === i ? GOLD_DIM : SURFACE, border: `1.5px solid ${selDate === i ? GOLD : BORDER}` }}>
                <span className="text-xs" style={{ color: selDate === i ? GOLD : "#555" }}>{d.label}</span>
                <span className="text-xl" style={{ color: selDate === i ? GOLD_LIGHT : "#DDD" }}>{d.day}</span>
              </button>
            ))}
          </div>
          {selDate !== null && (
            <div className="rounded-xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <button key={slot.time} onClick={() => slot.avail && setSelTime(slot.time)} disabled={!slot.avail} className="py-2 rounded-lg text-xs transition-all" style={!slot.avail ? { background: "#0E0E0E", color: "#2A2A2A", textDecoration: "line-through" } : selTime === slot.time ? { background: GOLD_DIM, color: GOLD_LIGHT, border: `1px solid ${GOLD}` } : { background: SURFACE2, color: "#CCC", border: `1px solid ${BORDER}` }}>
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="text-white mb-1" style={{ fontFamily: FONT_DISPLAY, fontSize: "1.8rem" }}>Confirmá tu turno</h2>
          <div className="rounded-xl overflow-hidden mt-6 mb-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            {[["Sucursal", branch?.nombre], ["Servicio", service?.nombre], ["Barbero", barber?.nombre], ["Fecha", `${date?.day} de ${date?.month}`], ["Hora", selTime]].map(([k, v]) => (
              <div key={k} className="flex justify-between px-5 py-3 border-b border-zinc-800 text-sm"><span className="text-zinc-500">{k}</span><span className="text-zinc-200">{v}</span></div>
            ))}
            <div className="flex justify-between px-5 py-4"><span className="text-zinc-400">Total</span><span style={{ color: GOLD_LIGHT, fontSize: "1.2rem" }}>${service?.precio}</span></div>
          </div>
          <button onClick={handleConfirm} className="w-full py-4 rounded-xl font-medium" style={{ background: GOLD, color: "#000" }}>✓ Confirmar Turno</button>
        </div>
      )}

      <div className="flex justify-between mt-10 pt-6 border-t border-zinc-800">
        <button onClick={() => (step === 1 ? navigate("/client") : setStep(s => s - 1))} className="px-5 py-2.5 rounded-lg text-sm bg-zinc-800 text-zinc-400">Anterior</button>
        {step < 5 && <button onClick={() => canNext && setStep(s => s + 1)} disabled={!canNext} className="px-6 py-2.5 rounded-lg text-sm" style={{ background: canNext ? GOLD : "#333", color: canNext ? "#000" : "#666" }}>Siguiente</button>}
      </div>
    </div>
  );
}