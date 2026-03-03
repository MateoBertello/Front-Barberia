import React, { useState, useEffect } from "react";
import { Plus, Scissors } from "lucide-react";
import { apiClient } from "../utils/apsClient";

const Input = ({ label, value, onChange, type = "text" }: any) => (
  <div className="mb-3"><label className="block text-zinc-500 text-xs mb-1 uppercase">{label}</label><input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full rounded bg-zinc-900 border border-zinc-800 p-2 text-white outline-none focus:border-yellow-500"/></div>
);

export function ServicesManagement() {
  const [services, setServices] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", duration: "", price: "" });

  const load = () => apiClient<any[]>("/servicios").then(setServices).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try {
      await apiClient("/servicios", {
        method: "POST",
        body: JSON.stringify({ nombre: form.name, duracion: parseInt(form.duration), precio: parseFloat(form.price), estado: "ACTIVO" }),
        successMessage: "Servicio guardado"
      });
      setShowModal(false); setForm({ name: "", duration: "", price: "" }); load();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("¿Borrar?")) return;
    try { await apiClient(`/servicios/${id}`, { method: "DELETE" }); setServices(s => s.filter(x => x.id !== id)); } catch(e) { console.error(e); }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between mb-8"><h1 className="text-white text-2xl font-bold">Servicios</h1><button onClick={() => setShowModal(true)} className="flex gap-2 px-4 py-2 rounded bg-yellow-600 text-black font-medium"><Plus className="w-4 h-4" /> Nuevo</button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map(s => (
          <div key={s.id} className="p-5 rounded-xl bg-zinc-900 border border-zinc-800">
             <div className="flex justify-between mb-2"><Scissors className="text-yellow-500 w-5 h-5" /><span className="text-white font-bold">${s.precio}</span></div>
             <h3 className="text-white font-medium">{s.nombre}</h3>
             <p className="text-zinc-500 text-xs mb-4">{s.duracion} min</p>
             <button onClick={() => handleDelete(s.id)} className="w-full py-2 rounded border border-red-900/30 text-red-400 hover:bg-red-900/10 text-xs">Eliminar</button>
          </div>
        ))}
      </div>
      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"><div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex justify-between mb-4"><h3 className="text-white font-bold">Nuevo Servicio</h3><button onClick={() => setShowModal(false)} className="text-zinc-500">✕</button></div>
          <Input label="Nombre" value={form.name} onChange={(v:string)=>setForm({...form, name: v})} />
          <div className="grid grid-cols-2 gap-4">
             <Input label="Duración (min)" value={form.duration} onChange={(v:string)=>setForm({...form, duration: v})} type="number" />
             <Input label="Precio ($)" value={form.price} onChange={(v:string)=>setForm({...form, price: v})} type="number" />
          </div>
          <button onClick={handleSave} className="w-full py-2 bg-yellow-600 text-black font-bold rounded mt-2">Guardar</button>
      </div></div>}
    </div>
  );
}