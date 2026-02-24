import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Scissors, ToggleLeft, ToggleRight } from "lucide-react";
import { GOLD, GOLD_LIGHT, GOLD_DIM, SURFACE, SURFACE2, BORDER, BORDER2 } from "../../constants";

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  active: boolean;
}

const initialServices: Service[] = [
  { id: 1, name: "Corte Clásico", description: "Tijera y navaja, acabado perfecto", duration: 30, price: 2500, active: true },
  { id: 2, name: "Fade Premium", description: "Degradé de alta precisión + definición", duration: 45, price: 3200, active: true },
  { id: 3, name: "Barba Completa", description: "Perfilado, afeitado y aceites naturales", duration: 30, price: 1800, active: true },
  { id: 4, name: "Corte + Barba", description: "Servicio completo combinado", duration: 60, price: 4500, active: true },
  { id: 5, name: "Color & Decoloración", description: "Colorimetría profesional con productos premium", duration: 90, price: 6500, active: false },
  { id: 6, name: "Tratamiento Capilar", description: "Hidratación y keratina para el cabello", duration: 45, price: 3800, active: true },
];

const emptyForm = { name: "", description: "", duration: "", price: "", active: true };

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-700 outline-none"
        style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}
        onFocus={(e) => (e.target.style.borderColor = GOLD)}
        onBlur={(e) => (e.target.style.borderColor = BORDER)}
      />
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ background: "#141414", border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${BORDER2}` }}>
          <h3 className="text-white text-sm font-medium">{title}</h3>
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ServicesManagement() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const setField = (field: keyof typeof emptyForm) => (value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (s: Service) => {
    setEditingId(s.id);
    setForm({ name: s.name, description: s.description, duration: String(s.duration), price: String(s.price), active: s.active });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const data = {
      name: form.name,
      description: form.description,
      duration: parseInt(form.duration) || 30,
      price: parseInt(form.price) || 0,
      active: form.active,
    };
    if (editingId !== null) {
      setServices((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...data } : s)));
    } else {
      setServices((prev) => [...prev, { id: Date.now(), ...data }]);
    }
    setShowModal(false);
  };

  const toggleActive = (id: number) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  const handleDelete = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-zinc-500 text-sm">
          {services.filter((s) => s.active).length} servicios activos · {services.filter((s) => !s.active).length} inactivos
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}
        >
          <Plus className="w-4 h-4" />
          Agregar Servicio
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid #131313` }}>
                {["Servicio", "Descripción", "Duración", "Precio", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs text-zinc-700 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => (
                <tr
                  key={s.id}
                  className="transition-colors"
                  style={{ borderBottom: i < services.length - 1 ? `1px solid #111` : "none", opacity: s.active ? 1 : 0.55 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#181818")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: GOLD_DIM }}>
                        <Scissors className="w-3.5 h-3.5" style={{ color: GOLD }} />
                      </div>
                      <span className="text-zinc-100 text-sm font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-500 text-sm max-w-[200px]">
                    <span className="truncate block">{s.description}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-zinc-300 text-sm">{s.duration} min</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium" style={{ color: GOLD_LIGHT }}>${s.price.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleActive(s.id)}
                      className="flex items-center gap-1.5 text-xs transition-colors"
                      style={{ color: s.active ? "#4ADE80" : "#555" }}
                    >
                      {s.active
                        ? <ToggleRight className="w-5 h-5" style={{ color: "#4ADE80" }} />
                        : <ToggleLeft className="w-5 h-5 text-zinc-700" />}
                      {s.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}
                      >
                        <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}
                      >
                        <Trash2 className="w-3.5 h-3.5" style={{ color: "#F87171" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden flex flex-col divide-y" style={{ borderColor: "#131313" }}>
          {services.map((s) => (
            <div key={s.id} className="p-4" style={{ opacity: s.active ? 1 : 0.55 }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: GOLD_DIM }}>
                    <Scissors className="w-4 h-4" style={{ color: GOLD }} />
                  </div>
                  <div>
                    <div className="text-zinc-200 text-sm font-medium">{s.name}</div>
                    <div className="text-zinc-600 text-xs">{s.duration} min</div>
                  </div>
                </div>
                <span className="text-sm font-medium" style={{ color: GOLD_LIGHT }}>${s.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between ml-12">
                <span className="text-zinc-600 text-xs">{s.description}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEdit(s)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
                    <Edit2 className="w-3 h-3 text-zinc-500" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}>
                    <Trash2 className="w-3 h-3" style={{ color: "#F87171" }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal title={editingId ? "Editar Servicio" : "Nuevo Servicio"} onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <Input label="Nombre del servicio" value={form.name} onChange={setField("name")} placeholder="Ej. Corte con diseño" />
            <div>
              <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Descripción breve del servicio"
                rows={2}
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-700 outline-none resize-none"
                style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}
                onFocus={(e) => (e.target.style.borderColor = GOLD)}
                onBlur={(e) => (e.target.style.borderColor = BORDER)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Duración (min)" value={form.duration} onChange={setField("duration")} placeholder="45" type="number" />
              <Input label="Precio ($)" value={form.price} onChange={setField("price")} placeholder="3200" type="number" />
            </div>
            <div>
              <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">Estado</label>
              <div className="flex gap-2">
                {[true, false].map((v) => (
                  <button
                    key={String(v)}
                    onClick={() => setForm((f) => ({ ...f, active: v }))}
                    className="flex-1 py-2 rounded-lg text-xs"
                    style={
                      form.active === v
                        ? { background: GOLD_DIM, border: `1px solid ${GOLD}`, color: GOLD_LIGHT }
                        : { background: SURFACE2, border: `1px solid ${BORDER}`, color: "#666" }
                    }
                  >
                    {v ? "● Activo" : "○ Inactivo"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: "#888" }}>
                Cancelar
              </button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}>
                {editingId ? "Guardar" : "Agregar"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
