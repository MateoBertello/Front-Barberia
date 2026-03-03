import React, { useState, useEffect } from "react";
import { Plus, MapPin } from "lucide-react";
import { apiClient } from "../utils/apsClient";

export function BranchManagement() {
  const [branches, setBranches] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", phone: "" });

  const load = () => apiClient<any[]>("/sucursales").then(setBranches).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try {
      await apiClient("/sucursales", {
        method: "POST",
        body: JSON.stringify({ nombre: form.name, direccion: form.address, telefono: form.phone, estado: "ACTIVA" }),
        successMessage: "Sucursal creada"
      });
      setShowModal(false); setForm({ name: "", address: "", phone: "" }); load();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between mb-8"><h1 className="text-white text-2xl font-bold">Sucursales</h1><button onClick={() => setShowModal(true)} className="flex gap-2 px-4 py-2 rounded bg-yellow-600 text-black font-medium"><Plus className="w-4 h-4" /> Nueva</button></div>
      <div className="grid gap-4">
        {branches.map(b => (
          <div key={b.id} className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center">
             <div><h3 className="text-white font-medium">{b.nombre}</h3><div className="text-zinc-500 text-sm flex gap-1 items-center"><MapPin className="w-3 h-3"/> {b.direccion}</div></div>
             <span className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-400">Activa</span>
          </div>
        ))}
      </div>
      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"><div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex justify-between mb-4"><h3 className="text-white font-bold">Nueva Sucursal</h3><button onClick={() => setShowModal(false)} className="text-zinc-500">✕</button></div>
          <div className="space-y-3">
             <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Nombre" className="w-full p-2 rounded bg-zinc-900 border border-zinc-800 text-white"/>
             <input value={form.address} onChange={e=>setForm({...form, address: e.target.value})} placeholder="Dirección" className="w-full p-2 rounded bg-zinc-900 border border-zinc-800 text-white"/>
             <input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} placeholder="Teléfono" className="w-full p-2 rounded bg-zinc-900 border border-zinc-800 text-white"/>
             <button onClick={handleSave} className="w-full py-2 bg-yellow-600 text-black font-bold rounded">Guardar</button>
          </div>
      </div></div>}
    </div>
  );
}