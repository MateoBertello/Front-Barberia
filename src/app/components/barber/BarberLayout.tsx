import React from "react";
import { Outlet, useNavigate } from "react-router";
import { Scissors, LogOut } from "lucide-react";

export function BarberLayout() {
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans">
       <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-16 bg-black/90 backdrop-blur border-b border-zinc-800">
          <div className="text-white font-bold">Panel Barbero</div>
          <button onClick={handleLogout} className="text-zinc-500 hover:text-white text-sm flex gap-2 items-center"><LogOut className="w-4 h-4"/> Salir</button>
       </header>
       <main><Outlet /></main>
    </div>
  );
}