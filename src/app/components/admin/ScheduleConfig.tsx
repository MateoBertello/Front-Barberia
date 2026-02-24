import React, { useState } from "react";
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

const barbers = ["Miguel Ángel Reyes", "Rodrigo Sosa", "Iván Pérez"];
const branches = ["BarberSaaS – Centro", "BarberSaaS – Palermo", "BarberSaaS – Belgrano"];

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
    <button
      onClick={onChange}
      className="relative flex-shrink-0 w-10 h-5 rounded-full transition-all duration-200"
      style={{ background: checked ? GOLD : "#2A2A2A", border: `1px solid ${checked ? GOLD : BORDER}` }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
        style={{
          left: checked ? "calc(100% - 18px)" : "2px",
          background: checked ? "#0A0A0A" : "#555",
        }}
      />
    </button>
  );
}

function TimeInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="rounded-lg px-3 py-2 text-sm outline-none transition-all w-full"
      style={{
        background: disabled ? "#111" : SURFACE2,
        border: `1px solid ${disabled ? "#1A1A1A" : BORDER}`,
        color: disabled ? "#333" : "#DDD",
        colorScheme: "dark",
      }}
      onFocus={(e) => { if (!disabled) e.target.style.borderColor = GOLD; }}
      onBlur={(e) => { if (!disabled) e.target.style.borderColor = BORDER; }}
    />
  );
}

export function ScheduleConfig() {
  const [selectedBarber, setSelectedBarber] = useState(barbers[0]);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [schedule, setSchedule] = useState<ScheduleMap>(defaultSchedule());
  const [saved, setSaved] = useState(false);

  const toggleDay = (day: string) => {
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }));
    setSaved(false);
  };

  const updateTime = (day: string, field: "start" | "end", value: string) => {
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
    setSaved(false);
  };

  const applyToAll = (day: string) => {
    const src = schedule[day];
    const updated: ScheduleMap = {};
    DAYS.forEach((d) => {
      if (d !== "Domingo") updated[d] = { ...schedule[d], start: src.start, end: src.end };
    });
    setSchedule((prev) => ({ ...prev, ...updated }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const enabledCount = DAYS.filter((d) => schedule[d].enabled).length;

  const selectStyle: React.CSSProperties = {
    background: SURFACE2,
    border: `1px solid ${BORDER}`,
    color: "#DDD",
    appearance: "none" as const,
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">Barbero</label>
          <select
            value={selectedBarber}
            onChange={(e) => { setSelectedBarber(e.target.value); setSaved(false); }}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={selectStyle}
            onFocus={(e) => (e.target.style.borderColor = GOLD)}
            onBlur={(e) => (e.target.style.borderColor = BORDER)}
          >
            {barbers.map((b) => (
              <option key={b} value={b} style={{ background: "#1A1A1A" }}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">Sucursal</label>
          <select
            value={selectedBranch}
            onChange={(e) => { setSelectedBranch(e.target.value); setSaved(false); }}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={selectStyle}
            onFocus={(e) => (e.target.style.borderColor = GOLD)}
            onBlur={(e) => (e.target.style.borderColor = BORDER)}
          >
            {branches.map((b) => (
              <option key={b} value={b} style={{ background: "#1A1A1A" }}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-px h-4" style={{ background: GOLD }} />
          <div>
            <span className="text-zinc-300 text-sm">{selectedBarber}</span>
            <span className="text-zinc-600 text-sm"> · {selectedBranch}</span>
          </div>
        </div>
        <span className="text-zinc-600 text-xs">{enabledCount} días activos</span>
      </div>

      {/* Desktop grid */}
      <div className="rounded-2xl overflow-hidden mb-6 hidden md:block" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
        {/* Table header */}
        <div
          className="grid items-center px-5 py-3"
          style={{ gridTemplateColumns: "130px 60px 1fr 1fr 140px", borderBottom: `1px solid ${BORDER2}`, gap: "16px" }}
        >
          {["Día", "Activo", "Hora inicio", "Hora fin", ""].map((h) => (
            <div key={h} className="text-zinc-700 text-xs uppercase tracking-wider">{h}</div>
          ))}
        </div>

        {/* Rows */}
        {DAYS.map((day, i) => {
          const s = schedule[day];
          return (
            <div
              key={day}
              className="grid items-center px-5 py-4 transition-colors"
              style={{
                gridTemplateColumns: "130px 60px 1fr 1fr 140px",
                gap: "16px",
                borderBottom: i < DAYS.length - 1 ? `1px solid #111` : "none",
                background: !s.enabled ? "rgba(0,0,0,0.2)" : "transparent",
              }}
              onMouseEnter={(e) => { if (s.enabled) e.currentTarget.style.background = "#181818"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = !s.enabled ? "rgba(0,0,0,0.2)" : "transparent"; }}
            >
              {/* Day name */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs flex-shrink-0 transition-all"
                  style={{
                    background: s.enabled ? GOLD_DIM : "#111",
                    border: `1px solid ${s.enabled ? GOLD : BORDER}`,
                    color: s.enabled ? GOLD_LIGHT : "#444",
                  }}
                >
                  {DAY_ABBR[day]}
                </div>
                <span className="text-sm" style={{ color: s.enabled ? "#DDD" : "#444" }}>{day}</span>
              </div>

              {/* Toggle */}
              <div>
                <Toggle checked={s.enabled} onChange={() => toggleDay(day)} />
              </div>

              {/* Start time */}
              <TimeInput value={s.start} onChange={(v) => updateTime(day, "start", v)} disabled={!s.enabled} />

              {/* End time */}
              <TimeInput value={s.end} onChange={(v) => updateTime(day, "end", v)} disabled={!s.enabled} />

              {/* Apply to all */}
              <div>
                {s.enabled && (
                  <button
                    onClick={() => applyToAll(day)}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
                    style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: "#666" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = GOLD_LIGHT; e.currentTarget.style.borderColor = GOLD; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#666"; e.currentTarget.style.borderColor = BORDER; }}
                  >
                    Aplicar a todos
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3 mb-6">
        {DAYS.map((day) => {
          const s = schedule[day];
          return (
            <div
              key={day}
              className="rounded-xl overflow-hidden"
              style={{
                background: s.enabled ? SURFACE : "#111",
                border: `1px solid ${s.enabled ? BORDER2 : "#1A1A1A"}`,
              }}
            >
              {/* Day header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: s.enabled ? `1px solid ${BORDER2}` : "none" }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs"
                    style={{ background: s.enabled ? GOLD_DIM : "#1A1A1A", border: `1px solid ${s.enabled ? GOLD : BORDER}`, color: s.enabled ? GOLD_LIGHT : "#444" }}
                  >
                    {DAY_ABBR[day]}
                  </div>
                  <span className="text-sm" style={{ color: s.enabled ? "#DDD" : "#444" }}>{day}</span>
                </div>
                <Toggle checked={s.enabled} onChange={() => toggleDay(day)} />
              </div>

              {/* Times */}
              {s.enabled && (
                <div className="grid grid-cols-2 gap-3 px-4 py-3">
                  <div>
                    <label className="block text-zinc-600 text-xs mb-1">Inicio</label>
                    <TimeInput value={s.start} onChange={(v) => updateTime(day, "start", v)} />
                  </div>
                  <div>
                    <label className="block text-zinc-600 text-xs mb-1">Fin</label>
                    <TimeInput value={s.end} onChange={(v) => updateTime(day, "end", v)} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer info + Save */}
      <div className="rounded-xl p-4 mb-4 flex items-center gap-3" style={{ background: GOLD_DIM, border: `1px solid rgba(201,168,76,0.25)` }}>
        <Clock className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
        <p className="text-zinc-400 text-xs">
          Los horarios configurados determinan las franjas disponibles para reservas en el sistema de turnos.
          Cada turno se genera en bloques de 30 minutos dentro del rango establecido.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-zinc-600 text-xs">
          {saved && (
            <span className="flex items-center gap-1.5" style={{ color: "#4ADE80" }}>
              <Check className="w-3.5 h-3.5" />
              Guardado correctamente
            </span>
          )}
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={
            saved
              ? { background: "rgba(74,222,128,0.1)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)" }
              : { background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }
          }
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Guardado" : "Guardar horarios"}
        </button>
      </div>
    </div>
  );
}
