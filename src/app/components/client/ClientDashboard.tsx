import React from "react";
import { useNavigate } from "react-router";
import {
  Calendar,
  Clock,
  MapPin,
  Scissors,
  Star,
  ChevronRight,
  User,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import { GOLD, GOLD_LIGHT, GOLD_DIM, FONT_DISPLAY, SURFACE, SURFACE2, BORDER, BORDER2 } from "../../constants";

// ── Mock data ─────────────────────────────────────────────────────────────────
const nextAppointment = {
  date: "Miércoles, 26 Feb 2026",
  time: "11:00",
  barber: "Miguel Ángel",
  barberImg: "https://images.unsplash.com/photo-1635301304768-5f2db6a5499b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
  service: "Fade Premium",
  branch: "BarberSaaS – Palermo",
  price: 3200,
  duration: "45 min",
};

const cutHistory = [
  { id: 1, date: "10 Feb 2026", service: "Corte Clásico", barber: "Rodrigo Sosa", branch: "Centro", price: 2500, status: "completado", rating: 5 },
  { id: 2, date: "22 Ene 2026", service: "Corte + Barba", barber: "Miguel Ángel", branch: "Palermo", price: 4500, status: "completado", rating: 5 },
  { id: 3, date: "05 Ene 2026", service: "Fade Premium", barber: "Miguel Ángel", branch: "Palermo", price: 3200, status: "completado", rating: 4 },
  { id: 4, date: "18 Dic 2025", service: "Barba Completa", barber: "Rodrigo Sosa", branch: "Belgrano", price: 1800, status: "cancelado", rating: null },
  { id: 5, date: "01 Dic 2025", service: "Corte Clásico", barber: "Rodrigo Sosa", branch: "Centro", price: 2500, status: "completado", rating: 4 },
];

const stats = [
  { label: "Cortes totales", value: "14" },
  { label: "Barbero favorito", value: "Miguel Ángel" },
  { label: "Sucursal habitual", value: "Palermo" },
  { label: "Total invertido", value: "$38.400" },
];

// ── Star rating ───────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-zinc-700 text-xs">Sin reseña</span>;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className="w-3 h-3"
          style={{ color: s <= rating ? GOLD : "#333", fill: s <= rating ? GOLD : "transparent" }}
        />
      ))}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export function ClientDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8">
      {/* Welcome */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-zinc-500 text-sm mb-1">Hola de nuevo 👋</p>
          <h1 className="text-white" style={{ fontFamily: FONT_DISPLAY, fontSize: "2rem", fontWeight: 500 }}>
            Lucas Fernández
          </h1>
        </div>
        <button
          onClick={() => navigate("/client/booking")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}
        >
          <Plus className="w-4 h-4" />
          Nueva Reserva
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
            <div className="text-zinc-500 text-xs mb-1">{label}</div>
            <div className="text-white text-sm font-medium truncate">{value}</div>
          </div>
        ))}
      </div>

      {/* ── Next appointment card ── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 rounded-full" style={{ background: GOLD }} />
          <h2 className="text-white text-sm font-medium tracking-wide">Mi próximo turno</h2>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #1A1200 0%, #141414 60%)`,
            border: `1.5px solid rgba(201,168,76,0.35)`,
            boxShadow: `0 0 40px rgba(201,168,76,0.06)`,
          }}
        >
          {/* Gold accent line */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />

          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              {/* Barber avatar */}
              <div className="flex-shrink-0">
                <img
                  src={nextAppointment.barberImg}
                  alt={nextAppointment.barber}
                  className="w-20 h-20 rounded-2xl object-cover"
                  style={{ border: `2px solid rgba(201,168,76,0.4)` }}
                />
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="text-white font-medium">{nextAppointment.service}</div>
                    <div className="text-zinc-400 text-sm mt-0.5">con {nextAppointment.barber}</div>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs flex-shrink-0"
                    style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.2)" }}
                  >
                    Confirmado
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
                    <span className="text-zinc-300 text-xs">{nextAppointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
                    <span className="text-zinc-300 text-xs">
                      {nextAppointment.time} hs · {nextAppointment.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
                    <span className="text-zinc-300 text-xs">{nextAppointment.branch}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between mt-5 pt-5"
              style={{ borderTop: `1px solid rgba(201,168,76,0.15)` }}
            >
              <div>
                <div className="text-zinc-500 text-xs">Total a pagar</div>
                <div className="text-white" style={{ color: GOLD_LIGHT, fontSize: "1.3rem", fontWeight: 600 }}>
                  ${nextAppointment.price.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-4 py-2 rounded-lg text-xs transition-all"
                  style={{ background: "#1A1A1A", border: `1px solid ${BORDER}`, color: "#888" }}
                >
                  Reprogramar
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-xs transition-all"
                  style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#F87171" }}
                >
                  Cancelar turno
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cut history ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 rounded-full" style={{ background: GOLD }} />
          <h2 className="text-white text-sm font-medium tracking-wide">Historial de cortes</h2>
          <span className="text-zinc-600 text-xs ml-1">({cutHistory.length})</span>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
          {/* Desktop table header */}
          <div
            className="hidden sm:grid grid-cols-12 gap-3 px-5 py-3"
            style={{ borderBottom: `1px solid #1A1A1A` }}
          >
            {[["Fecha", "col-span-2"], ["Servicio", "col-span-3"], ["Barbero", "col-span-2"], ["Sucursal", "col-span-2"], ["Precio", "col-span-1"], ["Calificación", "col-span-2"]].map(
              ([h, cls]) => (
                <div key={h} className={`${cls} text-zinc-600 text-xs uppercase tracking-wider`}>
                  {h}
                </div>
              )
            )}
          </div>

          {cutHistory.map((cut, i) => (
            <div
              key={cut.id}
              className="px-5 py-4 transition-colors"
              style={{ borderBottom: i < cutHistory.length - 1 ? `1px solid #131313` : "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#181818")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Desktop row */}
              <div className="hidden sm:grid grid-cols-12 gap-3 items-center">
                <div className="col-span-2 text-zinc-500 text-xs">{cut.date}</div>
                <div className="col-span-3 flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: GOLD_DIM }}
                  >
                    <Scissors className="w-3 h-3" style={{ color: GOLD }} />
                  </div>
                  <span className="text-zinc-200 text-sm truncate">{cut.service}</span>
                </div>
                <div className="col-span-2 text-zinc-400 text-sm truncate">{cut.barber}</div>
                <div className="col-span-2 text-zinc-500 text-xs">{cut.branch}</div>
                <div className="col-span-1 text-zinc-300 text-sm">${cut.price.toLocaleString()}</div>
                <div className="col-span-2 flex items-center gap-2">
                  <StarRating rating={cut.rating} />
                  {cut.status === "cancelado" && (
                    <span className="text-xs" style={{ color: "#F87171" }}>Cancelado</span>
                  )}
                </div>
              </div>

              {/* Mobile row */}
              <div className="sm:hidden flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: GOLD_DIM }}
                  >
                    <Scissors className="w-4 h-4" style={{ color: GOLD }} />
                  </div>
                  <div>
                    <div className="text-zinc-200 text-sm">{cut.service}</div>
                    <div className="text-zinc-600 text-xs">
                      {cut.date} · {cut.barber}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-zinc-300 text-sm">${cut.price.toLocaleString()}</div>
                  <div className="mt-0.5">
                    <StarRating rating={cut.rating} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/client/booking")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all"
            style={{ background: GOLD_DIM, border: `1.5px solid ${GOLD}`, color: GOLD_LIGHT }}
          >
            <Plus className="w-4 h-4" />
            Reservar nuevo turno
          </button>
        </div>
      </section>
    </div>
  );
}
