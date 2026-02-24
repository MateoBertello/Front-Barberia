import React, { useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, Clock, Check, ChevronLeft, ChevronRight, Scissors, Star, CalendarCheck, User } from "lucide-react";
import { GOLD, GOLD_LIGHT, GOLD_DIM, FONT_DISPLAY, SURFACE, SURFACE2, BORDER, BORDER2 } from "../../constants";

// ── Data ──────────────────────────────────────────────────────────────────────
const branches = [
  { id: 1, name: "BarberSaaS – Centro", address: "Av. Corrientes 1234, CABA", rating: 4.9, reviews: 312, image: "https://images.unsplash.com/photo-1759142235060-3191ee596c81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600" },
  { id: 2, name: "BarberSaaS – Palermo", address: "Thames 882, Palermo, CABA", rating: 4.8, reviews: 198, image: "https://images.unsplash.com/photo-1769034260387-39fa07f0c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600" },
  { id: 3, name: "BarberSaaS – Belgrano", address: "Cabildo 2100, Belgrano, CABA", rating: 4.7, reviews: 145, image: "https://images.unsplash.com/photo-1759134198561-e2041049419c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600" },
];
const services = [
  { id: 1, name: "Corte Clásico", desc: "Tijera y navaja, acabado perfecto", duration: "30 min", price: 2500 },
  { id: 2, name: "Fade Premium", desc: "Degradé de alta precisión + definición", duration: "45 min", price: 3200 },
  { id: 3, name: "Barba Completa", desc: "Perfilado, afeitado y aceites", duration: "30 min", price: 1800 },
  { id: 4, name: "Corte + Barba", desc: "Servicio completo combinado", duration: "60 min", price: 4500 },
  { id: 5, name: "Color & Decoloración", desc: "Colorimetría profesional", duration: "90 min", price: 6500 },
];
const barbers = [
  { id: 1, name: "Miguel Ángel", specialty: "Fade & Degradés", rating: 4.9, reviews: 203, img: "https://images.unsplash.com/photo-1635301304768-5f2db6a5499b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
  { id: 2, name: "Rodrigo Sosa", specialty: "Cortes Clásicos", rating: 4.8, reviews: 167, img: "https://images.unsplash.com/photo-1771594836586-837aa05be563?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400" },
  { id: 3, name: "Primer disponible", specialty: "Cualquier barbero", rating: null, reviews: null, img: null },
];
const dates = [
  { label: "Lun", day: 23, month: "Feb" },
  { label: "Mar", day: 24, month: "Feb" },
  { label: "Mié", day: 25, month: "Feb" },
  { label: "Jue", day: 26, month: "Feb" },
  { label: "Vie", day: 27, month: "Feb" },
  { label: "Sáb", day: 28, month: "Feb" },
];
const timeSlots = [
  { time: "09:00", avail: true }, { time: "09:30", avail: true }, { time: "10:00", avail: false },
  { time: "10:30", avail: true }, { time: "11:00", avail: true }, { time: "11:30", avail: false },
  { time: "12:00", avail: true }, { time: "12:30", avail: true }, { time: "14:00", avail: true },
  { time: "14:30", avail: false }, { time: "15:00", avail: true }, { time: "15:30", avail: true },
  { time: "16:00", avail: true }, { time: "16:30", avail: false }, { time: "17:00", avail: true },
  { time: "17:30", avail: true },
];
const STEP_LABELS = ["Sucursal", "Servicio", "Barbero", "Fecha & Hora", "Confirmar"];

// ── Progress bar ──────────────────────────────────────────────────────────────
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
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all"
                style={{
                  background: done ? GOLD : active ? "transparent" : SURFACE2,
                  border: done ? "none" : active ? `2px solid ${GOLD}` : `2px solid ${BORDER}`,
                  color: done ? "#000" : active ? GOLD : "#444",
                }}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : num}
              </div>
              <span className="text-xs whitespace-nowrap hidden sm:block" style={{ color: active ? GOLD_LIGHT : done ? "#666" : "#333" }}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="flex-1 h-px min-w-[20px]" style={{ background: done ? GOLD : BORDER }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Selected badge ────────────────────────────────────────────────────────────
function SelectedBadge() {
  return (
    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: GOLD }}>
      <Check className="w-3 h-3 text-black" />
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function BookingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selBranch, setSelBranch] = useState<number | null>(null);
  const [selService, setSelService] = useState<number | null>(null);
  const [selBarber, setSelBarber] = useState<number | null>(null);
  const [selDate, setSelDate] = useState<number | null>(null);
  const [selTime, setSelTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const branch = branches.find((b) => b.id === selBranch);
  const service = services.find((s) => s.id === selService);
  const barber = barbers.find((b) => b.id === selBarber);
  const date = selDate !== null ? dates[selDate] : null;

  const canNext =
    (step === 1 && selBranch !== null) ||
    (step === 2 && selService !== null) ||
    (step === 3 && selBarber !== null) ||
    (step === 4 && selDate !== null && selTime !== null) ||
    step === 5;

  if (confirmed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="text-center max-w-sm w-full">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: GOLD_DIM, border: `2px solid ${GOLD}` }}>
            <CalendarCheck className="w-9 h-9" style={{ color: GOLD }} />
          </div>
          <h2 className="text-white mb-2" style={{ fontFamily: FONT_DISPLAY, fontSize: "2.2rem", fontWeight: 500 }}>¡Turno Confirmado!</h2>
          <p className="text-zinc-400 text-sm mb-8">
            Te esperamos el <span style={{ color: GOLD_LIGHT }}>{date?.label} {date?.day} de {date?.month}</span> a las <span style={{ color: GOLD_LIGHT }}>{selTime}</span> hs.
          </p>
          <div className="rounded-xl overflow-hidden mb-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            {[["Sucursal", branch?.name], ["Servicio", service?.name], ["Barbero", barber?.name], ["Total", `$${service?.price?.toLocaleString()}`]].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between px-5 py-3" style={{ borderBottom: `1px solid #1A1A1A` }}>
                <span className="text-zinc-500 text-sm">{String(k)}</span>
                <span className="text-zinc-200 text-sm">{String(v)}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/client")} className="w-full py-3 rounded-xl text-sm" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}>
            Volver a mi perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Progress current={step} />

      {/* ── Step 1: Branch ── */}
      {step === 1 && (
        <div>
          <h2 className="text-white mb-1" style={{ fontFamily: FONT_DISPLAY, fontSize: "1.8rem", fontWeight: 500 }}>Seleccioná tu sucursal</h2>
          <p className="text-zinc-500 text-sm mb-6">Elegí la sede más conveniente para vos.</p>
          <div className="flex flex-col gap-3">
            {branches.map((b) => (
              <button key={b.id} onClick={() => setSelBranch(b.id)} className="flex items-stretch rounded-xl overflow-hidden text-left transition-all" style={{ background: SURFACE, border: `1.5px solid ${selBranch === b.id ? GOLD : BORDER}`, boxShadow: selBranch === b.id ? `0 0 20px rgba(201,168,76,0.12)` : "none" }}>
                <img src={b.image} alt={b.name} className="w-28 object-cover flex-shrink-0" />
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-white text-sm font-medium">{b.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" style={{ color: GOLD }} />
                        <span className="text-zinc-500 text-xs">{b.address}</span>
                      </div>
                    </div>
                    {selBranch === b.id && <SelectedBadge />}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-3 h-3 fill-current" style={{ color: GOLD }} />
                    <span className="text-zinc-300 text-xs">{b.rating}</span>
                    <span className="text-zinc-600 text-xs">({b.reviews} reseñas)</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Service ── */}
      {step === 2 && (
        <div>
          <h2 className="text-white mb-1" style={{ fontFamily: FONT_DISPLAY, fontSize: "1.8rem", fontWeight: 500 }}>Elegí un servicio</h2>
          <p className="text-zinc-500 text-sm mb-6">Seleccioná el tratamiento que querés.</p>
          <div className="flex flex-col gap-3">
            {services.map((s) => (
              <button key={s.id} onClick={() => setSelService(s.id)} className="flex items-center gap-4 p-4 rounded-xl text-left transition-all" style={{ background: SURFACE, border: `1.5px solid ${selService === s.id ? GOLD : BORDER}`, boxShadow: selService === s.id ? `0 0 18px rgba(201,168,76,0.1)` : "none" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: selService === s.id ? GOLD_DIM : SURFACE2 }}>
                  <Scissors className="w-4 h-4" style={{ color: selService === s.id ? GOLD : "#555" }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium">{s.name}</span>
                    <span className="text-sm font-medium" style={{ color: GOLD }}>${s.price.toLocaleString()}</span>
                  </div>
                  <div className="text-zinc-500 text-xs mt-0.5">{s.desc}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-zinc-600" />
                    <span className="text-zinc-600 text-xs">{s.duration}</span>
                  </div>
                </div>
                {selService === s.id && <SelectedBadge />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 3: Barber ── */}
      {step === 3 && (
        <div>
          <h2 className="text-white mb-1" style={{ fontFamily: FONT_DISPLAY, fontSize: "1.8rem", fontWeight: 500 }}>Seleccioná tu barbero</h2>
          <p className="text-zinc-500 text-sm mb-6">Elegí con quién querés trabajar.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {barbers.map((b) => (
              <button key={b.id} onClick={() => setSelBarber(b.id)} className="flex flex-col items-center gap-3 p-5 rounded-xl transition-all" style={{ background: SURFACE, border: `1.5px solid ${selBarber === b.id ? GOLD : BORDER}`, boxShadow: selBarber === b.id ? `0 0 20px rgba(201,168,76,0.12)` : "none" }}>
                <div className="relative">
                  {b.img ? (
                    <img src={b.img} alt={b.name} className="w-20 h-20 rounded-full object-cover" style={{ border: `2px solid ${selBarber === b.id ? GOLD : BORDER}` }} />
                  ) : (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: SURFACE2, border: `2px solid ${selBarber === b.id ? GOLD : BORDER}` }}>
                      <User className="w-8 h-8 text-zinc-600" />
                    </div>
                  )}
                  {selBarber === b.id && (
                    <div className="absolute -bottom-1 -right-1"><SelectedBadge /></div>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-white text-sm font-medium">{b.name}</div>
                  <div className="text-zinc-500 text-xs mt-0.5">{b.specialty}</div>
                  {b.rating && (
                    <div className="flex items-center justify-center gap-1 mt-1.5">
                      <Star className="w-3 h-3 fill-current" style={{ color: GOLD }} />
                      <span className="text-zinc-400 text-xs">{b.rating}</span>
                      <span className="text-zinc-600 text-xs">({b.reviews})</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 4: Date & Time ── */}
      {step === 4 && (
        <div>
          <h2 className="text-white mb-1" style={{ fontFamily: FONT_DISPLAY, fontSize: "1.8rem", fontWeight: 500 }}>Elegí fecha y hora</h2>
          <p className="text-zinc-500 text-sm mb-6">Seleccioná el día y el turno disponible.</p>
          {/* Date pills */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {dates.map((d, i) => (
              <button key={i} onClick={() => setSelDate(i)} className="flex flex-col items-center px-4 py-3 rounded-xl transition-all flex-shrink-0 min-w-[68px]" style={{ background: selDate === i ? GOLD_DIM : SURFACE, border: `1.5px solid ${selDate === i ? GOLD : BORDER}` }}>
                <span className="text-xs" style={{ color: selDate === i ? GOLD : "#555" }}>{d.label}</span>
                <span className="text-xl" style={{ color: selDate === i ? GOLD_LIGHT : "#DDD" }}>{d.day}</span>
                <span className="text-xs text-zinc-600">{d.month}</span>
              </button>
            ))}
          </div>
          {/* Time grid */}
          <div className="rounded-xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
            <p className="text-zinc-500 text-xs mb-4 tracking-wider uppercase">Horarios disponibles</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.avail && setSelTime(slot.time)}
                  disabled={!slot.avail}
                  className="py-2 rounded-lg text-xs text-center transition-all"
                  style={
                    !slot.avail
                      ? { background: "#0E0E0E", color: "#2A2A2A", cursor: "not-allowed", border: "1px solid #161616", textDecoration: "line-through" }
                      : selTime === slot.time
                      ? { background: GOLD_DIM, color: GOLD_LIGHT, border: `1px solid ${GOLD}` }
                      : { background: SURFACE2, color: "#CCC", border: `1px solid ${BORDER}` }
                  }
                >
                  {slot.time}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {[["Disponible", SURFACE2, BORDER, "#CCC"], ["Seleccionado", GOLD_DIM, GOLD, GOLD_LIGHT], ["No disponible", "#0E0E0E", "#161616", "#2A2A2A"]].map(([label, bg, border, color]) => (
                <div key={String(label)} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ background: String(bg), border: `1px solid ${String(border)}` }} />
                  <span className="text-zinc-600 text-xs">{String(label)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 5: Summary ── */}
      {step === 5 && (
        <div>
          <h2 className="text-white mb-1" style={{ fontFamily: FONT_DISPLAY, fontSize: "1.8rem", fontWeight: 500 }}>Confirmá tu turno</h2>
          <p className="text-zinc-500 text-sm mb-6">Revisá el resumen antes de confirmar.</p>
          <div className="rounded-xl overflow-hidden mb-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="px-5 py-3" style={{ borderBottom: `1px solid ${BORDER2}` }}>
              <span className="text-zinc-500 text-xs uppercase tracking-wider">Resumen de reserva</span>
            </div>
            {[
              ["Sucursal", branch?.name],
              ["Servicio", `${service?.name} · ${service?.duration}`],
              ["Barbero", barber?.name],
              ["Fecha", date ? `${date.label} ${date.day} de ${date.month}` : "-"],
              ["Hora", selTime || "-"],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: `1px solid #1A1A1A` }}>
                <span className="text-zinc-500 text-sm w-24 flex-shrink-0">{String(k)}</span>
                <span className="text-zinc-200 text-sm">{String(v)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-zinc-400 text-sm">Total</span>
              <span style={{ color: GOLD_LIGHT, fontSize: "1.3rem", fontWeight: 600 }}>${service?.price.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={() => setConfirmed(true)}
            className="w-full py-4 rounded-xl text-sm font-medium"
            style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A", fontSize: "1rem" }}
          >
            ✓ Confirmar Turno
          </button>
          <p className="text-zinc-600 text-xs text-center mt-3">Recibirás una confirmación por email.</p>
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: `1px solid ${BORDER2}` }}>
        <button
          onClick={() => (step === 1 ? navigate("/client") : setStep((s) => s - 1))}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-all"
          style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "#777" }}
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 1 ? "Cancelar" : "Anterior"}
        </button>
        {step < 5 && (
          <button
            onClick={() => canNext && setStep((s) => s + 1)}
            disabled={!canNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm transition-all"
            style={
              canNext
                ? { background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }
                : { background: SURFACE2, color: "#444", cursor: "not-allowed", border: `1px solid ${BORDER}` }
            }
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
