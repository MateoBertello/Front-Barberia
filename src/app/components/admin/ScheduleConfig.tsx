import React from "react";
import { Clock } from "lucide-react";

export function ScheduleConfig() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-white text-2xl font-bold mb-6">Configuración de Horarios</h1>
      <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
        <Clock className="w-10 h-10 text-yellow-600 mx-auto mb-4" />
        <h3 className="text-white text-lg font-medium mb-2">Próximamente</h3>
        <p className="text-zinc-500">Aquí podrás configurar los horarios de apertura y cierre de cada sucursal.</p>
      </div>
    </div>
  );
}