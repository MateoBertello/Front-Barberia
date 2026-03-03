import React, { useState, useEffect } from "react";
import { Save, Check, Clock } from "lucide-react";
import { GOLD, GOLD_LIGHT, GOLD_DIM, SURFACE, SURFACE2, BORDER, BORDER2 } from "../../constants";

interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
}

interface ScheduleMap {
  [day: string]: DaySchedule;
}

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const DAY_ABBR: Record<string, string> = {
  Lunes: "Lun", Martes: "Mar", Miércoles: "Mié", Jueves: "Jue", Viernes: "Vie", Sábado: "Sáb", Domingo: "Dom",
};

const defaultSchedule = (): ScheduleMap => ({
  Lunes: { enabled: true, start: "09:00", end: "18:00" },
  Martes: { enabled: true, start: "09:00", end: "18:00" },
  Miércoles: { enabled: true, start: "09:00", end: "18:00" },
  Jueves: { enabled: true, start: "09:00", end: "18:00" },
  Viernes: { enabled: true, start: "09:00", end: "20:00" },
  Sábado: { enabled: true, start: "10:00", end: "18:00" },
  Domingo: { enabled: false, start: "10:00", end: "14:00" },
});

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="relative flex-shrink-0 w-10 h-5 rounded-full transition-all duration-200" style={{ background: checked ? GOLD : "#2A2A2A", border: `1px solid ${checked ? GOLD : BORDER}` }}>
      <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200" style={{ left: checked ? "calc(100% - 18px)" : "2px", background: checked ? "#0A0A0A" : "#555" }} />
    </button>
  );
}

function TimeInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <input type="time" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="rounded-lg px-3 py-2 text-sm outline-none transition-all w-full" style={{ background: disabled ? "#111" : SURFACE2, border: `1px solid ${disabled ? "#1A1A1A" : BORDER}`, color: disabled ? "#333" : "#DDD", colorScheme: "dark" }} onFocus={(e) => { if (!disabled) e.target.style.borderColor = GOLD; }} onBlur={(e) => { if (!disabled) e.target.style.borderColor = BORDER; }} />
  );
}

export function ScheduleConfig() {
  // Estados para datos reales de la BD
  const [barbers, setBarbers] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState<number | "">("");
  const [selectedBranchId, setSelectedBranchId] = useState<number | "">("");
  
  const [schedule, setSchedule] = useState<ScheduleMap>(defaultSchedule());
  const [saved, setSaved] = useState(false);

  // --- GET: CARGAR BARBEROS Y SUCURSALES ---
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/usuarios").then(r => r.json()),
      fetch("http://localhost:8080/api/sucursales").then(r => r.json())
    ]).then(([usuariosData, sucursalesData]) => {
      // Filtramos para mostrar solo barberos activos y sucursales activas
      const soloBarberos = usuariosData.filter((u: any) => u.rol === 'BARBERO' && u.activo !== false);
      const sucursalesActivas = sucursalesData.filter((s: any) => s.activa !== false);

      setBarbers(soloBarberos);
      setBranches(sucursalesActivas);

      if (soloBarberos.length > 0) setSelectedBarberId(soloBarberos[0].id);
      if (sucursalesActivas.length > 0) setSelectedBranchId(sucursalesActivas[0].id);
    }).catch(err => console.error("Error al cargar datos", err));
  }, []);

  const toggleDay = (day: string) => { setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } })); setSaved(false); };
  const updateTime = (day: string, field: "start" | "end", value: string) => { setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } })); setSaved(false); };
  const applyToAll = (day: string) => {
    const src = schedule[day];
    const updated: ScheduleMap = {};
    DAYS.forEach((d) => { if (d !== "Domingo") updated[d] = { ...schedule[d], start: src.start, end: src.end }; });
    setSchedule((prev) => ({ ...prev, ...updated })); setSaved(false);
  };

  // --- POST: GUARDAR HORARIOS EN JAVA ---
  const handleSave = async () => {
    if (!selectedBarberId || !selectedBranchId) {
      alert("Debes seleccionar un barbero y una sucursal.");
      return;
    }

    try {
      // Por cada día activado, mandamos un POST a Java
      for (const day of DAYS) {
        if (schedule[day].enabled) {
          const horarioJava = {
            barbero: { id: selectedBarberId },
            sucursal: { id: selectedBranchId },
            diaSemana: day.toUpperCase(),
            horaInicio: `${schedule[day].start}:00`,
            horaFin: `${schedule[day].end}:00`
          };

          await fetch("http://localhost:8080/api/horarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(horarioJava)
          });
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error al guardar horario", error);
      alert("Hubo un error al guardar los horarios.");
    }
  };

  const enabledCount = DAYS.filter((d) => schedule[d].enabled).length;
  
  const barberName = barbers.find(b => b.id === Number(selectedBarberId))?.nombre || "Cargando...";
  const branchName = branches.find(b => b.id === Number(selectedBranchId))?.nombre || "Cargando...";

  return (
    <div className="p-4 lg:p-6 max-w-4xl">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">Barbero</label>
          <select value={selectedBarberId} onChange={(e) => { setSelectedBarberId(Number(e.target.value)); setSaved(false); }} className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: "#DDD", appearance: "none" }}>
            {barbers.map((b) => <option key={b.id} value={b.id} style={{ background: "#1A1A1A" }}>{b.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">Sucursal</label>
          <select value={selectedBranchId} onChange={(e) => { setSelectedBranchId(Number(e.target.value)); setSaved(false); }} className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: "#DDD", appearance: "none" }}>
            {branches.map((b) => <option key={b.id} value={b.id} style={{ background: "#1A1A1A" }}>{b.nombre}</option>)}
          </select>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-px h-4" style={{ background: GOLD }} />
          <div><span className="text-zinc-300 text-sm">{barberName}</span><span className="text-zinc-600 text-sm"> · {branchName}</span></div>
        </div>
        <span className="text-zinc-600 text-xs">{enabledCount} días activos</span>
      </div>

      {/* Desktop grid */}
      <div className="rounded-2xl overflow-hidden mb-6 hidden md:block" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
        <div className="grid items-center px-5 py-3" style={{ gridTemplateColumns: "130px 60px 1fr 1fr 140px", borderBottom: `1px solid ${BORDER2}`, gap: "16px" }}>
          {["Día", "Activo", "Hora inicio", "Hora fin", ""].map((h) => (<div key={h} className="text-zinc-700 text-xs uppercase tracking-wider">{h}</div>))}
        </div>
        {DAYS.map((day, i) => {
          const s = schedule[day];
          return (
            <div key={day} className="grid items-center px-5 py-4 transition-colors" style={{ gridTemplateColumns: "130px 60px 1fr 1fr 140px", gap: "16px", borderBottom: i < DAYS.length - 1 ? `1px solid #111` : "none", background: !s.enabled ? "rgba(0,0,0,0.2)" : "transparent" }}>
              <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs flex-shrink-0 transition-all" style={{ background: s.enabled ? GOLD_DIM : "#111", border: `1px solid ${s.enabled ? GOLD : BORDER}`, color: s.enabled ? GOLD_LIGHT : "#444" }}>{DAY_ABBR[day]}</div><span className="text-sm" style={{ color: s.enabled ? "#DDD" : "#444" }}>{day}</span></div>
              <div><Toggle checked={s.enabled} onChange={() => toggleDay(day)} /></div>
              <TimeInput value={s.start} onChange={(v) => updateTime(day, "start", v)} disabled={!s.enabled} />
              <TimeInput value={s.end} onChange={(v) => updateTime(day, "end", v)} disabled={!s.enabled} />
              <div>{s.enabled && (<button onClick={() => applyToAll(day)} className="text-xs px-3 py-1.5 rounded-lg transition-all whitespace-nowrap" style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: "#666" }}>Aplicar a todos</button>)}</div>
            </div>
          );
        })}
      </div>

      {/* Footer info + Save */}
      <div className="rounded-xl p-4 mb-4 flex items-center gap-3" style={{ background: GOLD_DIM, border: `1px solid rgba(201,168,76,0.25)` }}>
        <Clock className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
        <p className="text-zinc-400 text-xs">Los horarios configurados determinan las franjas disponibles para reservas en el sistema de turnos. Cada turno se genera en bloques de 30 minutos dentro del rango establecido.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-zinc-600 text-xs">{saved && (<span className="flex items-center gap-1.5" style={{ color: "#4ADE80" }}><Check className="w-3.5 h-3.5" /> Guardado correctamente</span>)}</div>
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all" style={saved ? { background: "rgba(74,222,128,0.1)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)" } : { background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}>
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Guardado" : "Guardar horarios"}
        </button>
      </div>
    </div>
  );
}