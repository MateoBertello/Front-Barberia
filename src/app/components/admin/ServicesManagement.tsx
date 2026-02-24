import React, { useState, useEffect } from "react";
import { Plus, Clock, DollarSign, Edit2, Trash2, X, Scissors } from "lucide-react";
import { GOLD, GOLD_LIGHT, GOLD_DIM, SURFACE, SURFACE2, BORDER, BORDER2 } from "../../constants";

interface ServiceItem {
  id: number;
  name: string;
  duration: string;
  price: string;
  status: "activo" | "inactivo";
}

const emptyForm = { name: "", duration: "", price: "", status: "activo" as "activo" | "inactivo" };

function Input({ label, value, onChange, placeholder, type = "text", icon: Icon }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; icon?: React.ElementType }) {
  return (
    <div>
      <label className="block text-zinc-500 text-xs mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2"><Icon className="w-4 h-4 text-zinc-500" /></div>}
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full rounded-lg py-2.5 text-sm text-white placeholder-zinc-700 outline-none transition-colors ${Icon ? "pl-9 pr-3" : "px-3"}`}
          style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}
          onFocus={(e) => (e.target.style.borderColor = GOLD)} onBlur={(e) => (e.target.style.borderColor = BORDER)}
        />
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ background: "#141414", border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${BORDER2}` }}>
          <h3 className="text-white text-sm font-medium">{title}</h3>
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ServicesManagement() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // --- GET: OBTENER SERVICIOS DESDE JAVA ---
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/servicios");
        if (res.ok) {
          const data = await res.json();
          setServices(data.map((srv: any) => ({
            id: srv.id,
            name: srv.nombre,
            duration: `${srv.duracionMinutos} min`,
            price: `$${srv.precio}`,
            status: srv.activo ? "activo" : "inactivo"
          })));
        }
      } catch (error) { console.error("Error cargando servicios", error); }
    };
    cargarServicios();
  }, []);

  const setField = (field: keyof typeof emptyForm) => (value: string) => setForm((f) => ({ ...f, [field]: value }));

  // --- POST: CREAR SERVICIO EN JAVA ---
  const handleSave = async () => {
    if (!form.name || !form.duration || !form.price) return;

    const servicioJava = {
      nombre: form.name,
      duracionMinutos: parseInt(form.duration.replace(/\D/g, '') || "0"),
      precio: parseFloat(form.price.replace(/\D/g, '') || "0"),
      activo: form.status === "activo"
    };

    try {
      const res = await fetch("http://localhost:8080/api/servicios", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(servicioJava)
      });
      if (res.ok) {
        const srvGuardado = await res.json();
        setServices((prev) => [...prev, {
          id: srvGuardado.id, name: srvGuardado.nombre, duration: `${srvGuardado.duracionMinutos} min`, price: `$${srvGuardado.precio}`, status: srvGuardado.activo ? "activo" : "inactivo"
        }]);
      }
    } catch (error) { console.error("Error guardando", error); }
    setShowModal(false);
  };

  const toggleStatus = (id: number) => { setServices((prev) => prev.map((s) => (s.id === id ? { ...s, status: s.status === "activo" ? "inactivo" : "activo" } : s))); };

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Catálogo de Servicios</h2>
          <p className="text-zinc-500 text-sm">Gestioná los cortes y precios de tu barbería</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}>
          <Plus className="w-4 h-4" /> Nuevo Servicio
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER2}` }}>
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b text-xs font-medium text-zinc-500 uppercase tracking-wider" style={{ borderColor: BORDER }}>
          <div className="col-span-5">Servicio</div><div className="col-span-2 text-center">Duración</div><div className="col-span-2 text-center">Precio</div><div className="col-span-3 text-right">Acciones</div>
        </div>
        <div className="divide-y divide-zinc-800/50">
          {services.map((s) => (
            <div key={s.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors hover:bg-white/5">
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}><Scissors className="w-4 h-4" style={{ color: GOLD }} /></div>
                <div><div className="text-sm font-medium text-white mb-0.5">{s.name}</div><span className="text-xs px-2 py-0.5 rounded-full" style={s.status === "activo" ? { background: "rgba(74,222,128,0.1)", color: "#4ADE80" } : { background: "rgba(248,113,113,0.1)", color: "#F87171" }}>{s.status === "activo" ? "Activo" : "Inactivo"}</span></div>
              </div>
              <div className="col-span-2 flex items-center justify-center gap-1.5 text-sm text-zinc-300"><Clock className="w-3.5 h-3.5 text-zinc-500" /> {s.duration}</div>
              <div className="col-span-2 flex items-center justify-center font-medium text-sm" style={{ color: GOLD_LIGHT }}>{s.price}</div>
              <div className="col-span-3 flex items-center justify-end gap-2">
                <button onClick={() => toggleStatus(s.id)} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: SURFACE2, color: s.status === "activo" ? "#F87171" : "#4ADE80" }}>{s.status === "activo" ? "Pausar" : "Activar"}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <Modal title="Nuevo Servicio" onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <Input label="Nombre del servicio" value={form.name} onChange={setField("name")} placeholder="Ej. Corte Clásico + Barba" icon={Scissors} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Duración (minutos)" value={form.duration} onChange={setField("duration")} placeholder="Ej. 45" type="number" icon={Clock} />
              <Input label="Precio ($)" value={form.price} onChange={setField("price")} placeholder="Ej. 15000" type="number" icon={DollarSign} />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: SURFACE2, color: "#888" }}>Cancelar</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #A8832A 100%)`, color: "#0A0A0A" }}>Crear servicio</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}