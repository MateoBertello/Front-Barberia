import React, { useState, useEffect } from "react";
import { Plus, Mail, Trash2 } from "lucide-react";
import { apiClient } from "../utils/apsClient";
import { GOLD, SURFACE, SURFACE2, BORDER } from "../../constants";

// Componentes UI simples internos
const Input = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="mb-3">
    <label className="block text-zinc-500 text-xs mb-1 uppercase">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded bg-zinc-900 border border-zinc-800 p-2 text-white outline-none focus:border-yellow-500"/>
  </div>
);

const Modal = ({ title, onClose, children }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"><div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl p-6"><div className="flex justify-between mb-4"><h3 className="text-white font-bold">{title}</h3><button onClick={onClose} className="text-zinc-500">✕</button></div>{children}</div></div>
);

export function StaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const loadStaff = () => apiClient<any[]>("/usuarios").then(users => setStaff(users.filter(u => u.rol === "BARBERO"))).catch(console.error);
  useEffect(() => { loadStaff(); }, []);

  const handleSave = async () => {
    try {
      await apiClient("/auth/register", {
        method: "POST",
        body: JSON.stringify({ nombre: form.name, email: form.email, contrasena: form.password, telefono: form.phone, rol: "BARBERO" }),
        successMessage: "Barbero creado"
      });
      setShowModal(false); setForm({ name: "", email: "", phone: "", password: "" }); loadStaff();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("¿Eliminar?")) return;
    try { await apiClient(`/usuarios/${id}`, { method: "DELETE", successMessage: "Eliminado" }); setStaff(s => s.filter(b => b.id !== id)); } catch(e) { console.error(e); }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between mb-8"><h1 className="text-white text-2xl font-bold">Staff</h1><button onClick={() => setShowModal(true)} className="flex gap-2 px-4 py-2 rounded bg-yellow-600 text-black font-medium"><Plus className="w-4 h-4" /> Nuevo</button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staff.map(m => (
          <div key={m.id} className="p-5 rounded-xl bg-zinc-900 border border-zinc-800">
            <h3 className="text-white font-medium">{m.nombre}</h3>
            <div className="text-zinc-500 text-xs mt-1 flex gap-1"><Mail className="w-3 h-3"/> {m.email}</div>
            <button onClick={() => handleDelete(m.id)} className="mt-4 w-full py-2 rounded border border-red-900/30 text-red-400 hover:bg-red-900/10 text-xs">Eliminar</button>
          </div>
        ))}
      </div>
      {showModal && <Modal title="Nuevo Barbero" onClose={() => setShowModal(false)}>
        <Input label="Nombre" value={form.name} onChange={(v:string) => setForm({...form, name: v})} />
        <Input label="Email" value={form.email} onChange={(v:string) => setForm({...form, email: v})} />
        <Input label="Contraseña" value={form.password} onChange={(v:string) => setForm({...form, password: v})} type="password" />
        <Input label="Teléfono" value={form.phone} onChange={(v:string) => setForm({...form, phone: v})} />
        <button onClick={handleSave} className="w-full py-2 bg-yellow-600 text-black font-bold rounded mt-2">Guardar</button>
      </Modal>}
    </div>
  );
}