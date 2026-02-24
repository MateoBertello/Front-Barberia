import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Mail, Phone, Star, MapPin } from "lucide-react";
import { GOLD, GOLD_LIGHT, GOLD_DIM, SURFACE, SURFACE2, BORDER, BORDER2 } from "../../constants";

interface Barber {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  branch: string;
  rating: number;
  cuts: number;
  status: "activo" | "inactivo";
  img: string;
}

const branches = ["BarberSaaS – Centro", "BarberSaaS – Palermo", "BarberSaaS – Belgrano"];

const initialBarbers: Barber[] = [
  { id: 1, name: "Miguel Ángel Reyes", email: "miguel@barbersaas.com", phone: "+54 11 1111-2222", specialty: "Fade & Degradés", branch: "BarberSaaS – Palermo", rating: 4.9, cuts: 1203, status: "activo", img: "https://images.unsplash.com/photo-1635301304768-5f2db6a5499b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300" },
  { id: 2, name: "Rodrigo Sosa", email: "rodrigo@barbersaas.com", phone: "+54 11 3333-4444", specialty: "Cortes Clásicos", branch: "BarberSaaS – Centro", rating: 4.8, cuts: 987, status: "activo", img: "https://images.unsplash.com/photo-1771594836586-837aa05be563?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300" },
  { id: 3, name: "Iván Pérez", email: "ivan@barbersaas.com", phone: "+54 11 5555-6666", specialty: "Diseños & Barba", branch: "BarberSaaS – Belgrano", rating: 4.7, cuts: 654, status: "activo", img: "https://images.unsplash.com/photo-1758598305593-7c12d15687be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300" },
];

const emptyForm = { name: "", email: "", phone: "", specialty: "", branch: branches[0] };

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

export function StaffManagement() {
  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers);
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

  const openEdit = (b: Barber) => {
    setEditingId(b.id);
    setForm({ name: b.name, email: b.email, phone: b.phone, specialty: b.specialty, branch: b.branch });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingId !== null) {
      setBarbers((prev) => prev.map((b) => (b.id === editingId ? { ...b, ...form } : b)));
    } else {
      const imgs = [
        "https://images.unsplash.com/photo-1635301304768-5f2db6a5499b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300",
        "https://images.unsplash.com/photo-1771594836586-837aa05be563?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300",
      ];
      setBarbers((prev) => [
        ...prev,
        { id: Date.now(), ...form, rating: 0, cuts: 0, status: "activo", img: imgs[prev.length % imgs.length] },
      ]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => setBarbers((prev) => prev.filter((b) => b.id !== id));

  const toggleStatus = (id: number) => {
    setBarbers((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: b.status === "activo" ? "inactivo" : "activo" } : b))
    );
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-zinc-500 text-sm">
          {barbers.filter((b) => b.status === "activo").length} barberos activos
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}
        >
          <Plus className="w-4 h-4" />
          Registrar Barbero
        </button>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {barbers.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl overflow-hidden flex flex-col transition-all"
            style={{ background: SURFACE, border: `1px solid ${BORDER2}`, opacity: b.status === "inactivo" ? 0.6 : 1 }}
          >
            {/* Card header */}
            <div className="p-5 flex items-center gap-4" style={{ borderBottom: `1px solid ${BORDER2}` }}>
              <div className="relative flex-shrink-0">
                <img
                  src={b.img}
                  alt={b.name}
                  className="w-16 h-16 rounded-2xl object-cover"
                  style={{ border: `2px solid ${b.status === "activo" ? GOLD : BORDER}` }}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full"
                  style={{ background: b.status === "activo" ? "#4ADE80" : "#555", border: "2px solid #141414" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{b.name}</div>
                <div className="text-zinc-500 text-xs mt-0.5">{b.specialty}</div>
                {b.rating > 0 && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="w-3 h-3 fill-current" style={{ color: GOLD }} />
                    <span className="text-zinc-400 text-xs">{b.rating}</span>
                    <span className="text-zinc-700 text-xs">· {b.cuts} cortes</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 px-5 py-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 flex-shrink-0 text-zinc-600" />
                <span className="text-zinc-500 text-xs truncate">{b.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 flex-shrink-0 text-zinc-600" />
                <span className="text-zinc-500 text-xs">{b.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} />
                <span className="text-zinc-400 text-xs truncate">{b.branch}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => toggleStatus(b.id)}
                className="flex-1 py-2 rounded-lg text-xs transition-all"
                style={
                  b.status === "activo"
                    ? { background: "rgba(248,113,113,0.06)", color: "#F87171", border: "1px solid rgba(248,113,113,0.15)" }
                    : { background: "rgba(74,222,128,0.06)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.15)" }
                }
              >
                {b.status === "activo" ? "Desactivar" : "Activar"}
              </button>
              <button
                onClick={() => openEdit(b)}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}
              >
                <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
              </button>
              <button
                onClick={() => handleDelete(b.id)}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}
              >
                <Trash2 className="w-3.5 h-3.5" style={{ color: "#F87171" }} />
              </button>
            </div>
          </div>
        ))}

        {/* Add card */}
        <button
          onClick={openCreate}
          className="rounded-2xl flex flex-col items-center justify-center gap-3 min-h-[240px] transition-all"
          style={{ background: "rgba(201,168,76,0.02)", border: `2px dashed ${BORDER}` }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = GOLD)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: GOLD_DIM, border: `1px solid ${GOLD}` }}>
            <Plus className="w-5 h-5" style={{ color: GOLD }} />
          </div>
          <span className="text-zinc-600 text-sm">Registrar barbero</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal title={editingId ? "Editar Barbero" : "Registrar Barbero"} onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <Input label="Nombre completo" value={form.name} onChange={setField("name")} placeholder="Ej. Carlos López" />
            <Input label="Email" value={form.email} onChange={setField("email")} placeholder="carlos@barberia.com" type="email" />
            <Input label="Teléfono" value={form.phone} onChange={setField("phone")} placeholder="+54 11 0000-0000" type="tel" />
            <Input label="Especialidad" value={form.specialty} onChange={setField("specialty")} placeholder="Ej. Fade & Diseños" />
            <div>
              <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">Sucursal asignada</label>
              <select
                value={form.branch}
                onChange={(e) => setField("branch")(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none"
                style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}
                onFocus={(e) => (e.target.style.borderColor = GOLD)}
                onBlur={(e) => (e.target.style.borderColor = BORDER)}
              >
                {branches.map((br) => (
                  <option key={br} value={br} style={{ background: "#1A1A1A" }}>{br}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: "#888" }}>
                Cancelar
              </button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}>
                {editingId ? "Guardar" : "Registrar"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
