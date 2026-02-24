import React, { useState } from "react";
import { Plus, MapPin, Phone, Edit2, Trash2, X, Users, TrendingUp } from "lucide-react";
import { GOLD, GOLD_LIGHT, GOLD_DIM, SURFACE, SURFACE2, BORDER, BORDER2 } from "../../constants";

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  status: "activa" | "inactiva";
  barbers: number;
  monthlyRevenue: string;
  image: string;
}

const initialBranches: Branch[] = [
  { id: 1, name: "BarberSaaS – Centro", address: "Av. Corrientes 1234, CABA", phone: "+54 11 4000-1111", status: "activa", barbers: 3, monthlyRevenue: "$148.000", image: "https://images.unsplash.com/photo-1759142235060-3191ee596c81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600" },
  { id: 2, name: "BarberSaaS – Palermo", address: "Thames 882, Palermo, CABA", phone: "+54 11 4000-2222", status: "activa", barbers: 2, monthlyRevenue: "$112.000", image: "https://images.unsplash.com/photo-1769034260387-39fa07f0c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600" },
  { id: 3, name: "BarberSaaS – Belgrano", address: "Cabildo 2100, Belgrano, CABA", phone: "+54 11 4000-3333", status: "inactiva", barbers: 2, monthlyRevenue: "$0", image: "https://images.unsplash.com/photo-1759134198561-e2041049419c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600" },
];

const emptyForm = { name: "", address: "", phone: "", status: "activa" as "activa" | "inactiva" };

// ── Shared input ──────────────────────────────────────────────────────────────
function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-700 outline-none transition-colors"
        style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}
        onFocus={(e) => (e.target.style.borderColor = GOLD)}
        onBlur={(e) => (e.target.style.borderColor = BORDER)}
      />
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
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
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function BranchManagement() {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const setField = (field: keyof typeof emptyForm) => (value: string) => setForm((f) => ({ ...f, [field]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (b: Branch) => {
    setEditingId(b.id);
    setForm({ name: b.name, address: b.address, phone: b.phone, status: b.status });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.address.trim()) return;
    if (editingId !== null) {
      setBranches((prev) =>
        prev.map((b) => (b.id === editingId ? { ...b, ...form } : b))
      );
    } else {
      setBranches((prev) => [
        ...prev,
        { id: Date.now(), ...form, barbers: 0, monthlyRevenue: "$0", image: "https://images.unsplash.com/photo-1766113492854-0f61b7a864da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600" },
      ]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleStatus = (id: number) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: b.status === "activa" ? "inactiva" : "activa" } : b))
    );
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-zinc-500 text-sm">Gestioná tus sedes activas</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}
        >
          <Plus className="w-4 h-4" />
          Nueva Sucursal
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {branches.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.2) 60%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-white font-medium text-sm">{b.name}</div>
              </div>
              {/* Status badge */}
              <div className="absolute top-3 right-3">
                <span
                  className="px-2.5 py-1 rounded-full text-xs"
                  style={
                    b.status === "activa"
                      ? { background: "rgba(74,222,128,0.15)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)" }
                      : { background: "rgba(248,113,113,0.12)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }
                  }
                >
                  {b.status === "activa" ? "● Activa" : "● Inactiva"}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 p-4">
              <div className="flex items-start gap-2 mb-1.5">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: GOLD }} />
                <span className="text-zinc-400 text-xs">{b.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} />
                <span className="text-zinc-400 text-xs">{b.phone}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="rounded-lg p-2.5" style={{ background: "#111", border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Users className="w-3 h-3" style={{ color: GOLD }} />
                    <span className="text-zinc-600 text-xs">Barberos</span>
                  </div>
                  <div className="text-white text-sm font-medium">{b.barbers}</div>
                </div>
                <div className="rounded-lg p-2.5" style={{ background: "#111", border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <TrendingUp className="w-3 h-3" style={{ color: GOLD }} />
                    <span className="text-zinc-600 text-xs">Mes</span>
                  </div>
                  <div className="text-white text-sm font-medium">{b.monthlyRevenue}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 flex items-center gap-2">
              <button
                onClick={() => toggleStatus(b.id)}
                className="flex-1 py-2 rounded-lg text-xs transition-all"
                style={{
                  background: b.status === "activa" ? "rgba(248,113,113,0.06)" : "rgba(74,222,128,0.06)",
                  color: b.status === "activa" ? "#F87171" : "#4ADE80",
                  border: `1px solid ${b.status === "activa" ? "rgba(248,113,113,0.15)" : "rgba(74,222,128,0.15)"}`,
                }}
              >
                {b.status === "activa" ? "Desactivar" : "Activar"}
              </button>
              <button
                onClick={() => openEdit(b)}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}
              >
                <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
              </button>
              <button
                onClick={() => handleDelete(b.id)}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}
              >
                <Trash2 className="w-3.5 h-3.5" style={{ color: "#F87171" }} />
              </button>
            </div>
          </div>
        ))}

        {/* Empty add card */}
        <button
          onClick={openCreate}
          className="rounded-2xl flex flex-col items-center justify-center gap-3 min-h-[280px] transition-all"
          style={{ background: "rgba(201,168,76,0.03)", border: `2px dashed ${BORDER}` }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = GOLD)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: GOLD_DIM, border: `1px solid ${GOLD}` }}>
            <Plus className="w-5 h-5" style={{ color: GOLD }} />
          </div>
          <span className="text-zinc-600 text-sm">Agregar sucursal</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal title={editingId ? "Editar Sucursal" : "Nueva Sucursal"} onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <Input label="Nombre de la sucursal" value={form.name} onChange={setField("name")} placeholder="Ej. BarberSaaS – Microcentro" />
            <Input label="Dirección" value={form.address} onChange={setField("address")} placeholder="Ej. Florida 500, CABA" />
            <Input label="Teléfono" value={form.phone} onChange={setField("phone")} placeholder="+54 11 0000-0000" type="tel" />
            <div>
              <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">Estado inicial</label>
              <div className="flex gap-2">
                {(["activa", "inactiva"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm((f) => ({ ...f, status: s }))}
                    className="flex-1 py-2 rounded-lg text-xs capitalize transition-all"
                    style={
                      form.status === s
                        ? { background: GOLD_DIM, border: `1px solid ${GOLD}`, color: GOLD_LIGHT }
                        : { background: SURFACE2, border: `1px solid ${BORDER}`, color: "#666" }
                    }
                  >
                    {s === "activa" ? "● Activa" : "○ Inactiva"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: "#888" }}>
                Cancelar
              </button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}>
                {editingId ? "Guardar cambios" : "Crear sucursal"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
