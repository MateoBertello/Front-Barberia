import React, { useState, useEffect } from "react";
import { Plus, Mail, Phone, Edit2, Trash2, X, Star } from "lucide-react";
import { GOLD, GOLD_LIGHT, GOLD_DIM, SURFACE, SURFACE2, BORDER, BORDER2 } from "../../constants";

interface Barber {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "activo" | "inactivo";
  avatar: string;
}

const emptyForm = { name: "", email: "", phone: "", status: "activo" as "activo" | "inactivo" };

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-700 outline-none transition-colors" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }} onFocus={(e) => (e.target.style.borderColor = GOLD)} onBlur={(e) => (e.target.style.borderColor = BORDER)} />
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ background: "#141414", border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${BORDER2}` }}><h3 className="text-white text-sm font-medium">{title}</h3><button onClick={onClose} className="text-zinc-600 hover:text-zinc-400 transition-colors"><X className="w-4 h-4" /></button></div><div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function StaffManagement() {
  const [staff, setStaff] = useState<Barber[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // --- GET: OBTENER BARBEROS DESDE JAVA ---
  useEffect(() => {
    const cargarBarberos = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/usuarios"); // Deberíamos filtrar por rol, pero por ahora traemos todos
        if (res.ok) {
          const data = await res.json();
          const soloBarberos = data.filter((u: any) => u.rol === "BARBERO"); // Filtramos en React temporalmente
          
          setStaff(soloBarberos.map((b: any) => ({
            id: b.id, name: b.nombre, email: b.email, phone: b.telefono, status: "activo", avatar: `https://i.pravatar.cc/150?u=${b.id}`
          })));
        }
      } catch (error) { console.error("Error cargando barberos", error); }
    };
    cargarBarberos();
  }, []);

  const setField = (field: keyof typeof emptyForm) => (value: string) => setForm((f) => ({ ...f, [field]: value }));

  // --- POST: CREAR BARBERO EN JAVA ---
  const handleSave = async () => {
    if (!form.name || !form.email) return;

    const barberoJava = {
      nombre: form.name, email: form.email, contrasena: "123456", telefono: form.phone, rol: "BARBERO"
    };

    try {
      const res = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(barberoJava)
      });
      if (res.ok) {
        const bGuardado = await res.json();
        setStaff((prev) => [...prev, {
          id: bGuardado.id, name: bGuardado.nombre, email: bGuardado.email, phone: bGuardado.telefono, status: "activo", avatar: `https://i.pravatar.cc/150?u=${bGuardado.id}`
        }]);
      }
    } catch (error) { console.error("Error guardando", error); }
    setShowModal(false);
  };

  const toggleStatus = (id: number) => { setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, status: s.status === "activo" ? "inactivo" : "activo" } : s))); };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div><p className="text-zinc-500 text-sm">Gestioná tu equipo de barberos</p></div>
        <button onClick={() => { setForm(emptyForm); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}><Plus className="w-4 h-4" /> Nuevo Barbero</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <div key={member.id} className="rounded-2xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden" style={{ border: `2px solid ${BORDER}` }}><img src={member.avatar} alt={member.name} className="w-full h-full object-cover" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1"><h3 className="text-white font-medium text-sm truncate">{member.name}</h3></div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider mb-2" style={{ background: GOLD_DIM, color: GOLD_LIGHT, border: `1px solid ${BORDER}` }}>Barbero</span>
              </div>
            </div>
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-zinc-400 text-xs"><Mail className="w-3.5 h-3.5" />{member.email}</div>
              <div className="flex items-center gap-2 text-zinc-400 text-xs"><Phone className="w-3.5 h-3.5" />{member.phone}</div>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: BORDER2 }}>
              <button onClick={() => toggleStatus(member.id)} className="flex-1 py-2 rounded-lg text-xs transition-colors" style={{ background: member.status === "activo" ? "rgba(248,113,113,0.06)" : "rgba(74,222,128,0.06)", color: member.status === "activo" ? "#F87171" : "#4ADE80", border: `1px solid ${member.status === "activo" ? "rgba(248,113,113,0.15)" : "rgba(74,222,128,0.15)"}` }}>
                {member.status === "activo" ? "Suspender" : "Activar"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="Nuevo Miembro del Staff" onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <Input label="Nombre completo" value={form.name} onChange={setField("name")} placeholder="Ej. Martín López" />
            <Input label="Email" value={form.email} onChange={setField("email")} placeholder="martin@barbersaas.com" type="email" />
            <Input label="Teléfono" value={form.phone} onChange={setField("phone")} placeholder="+54 11 0000-0000" type="tel" />
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: SURFACE2, color: "#888" }}>Cancelar</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}>Registrar barbero</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}