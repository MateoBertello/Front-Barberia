import React from "react";
import { Outlet, useNavigate } from "react-router";
import { LayoutDashboard, Users, Star, MapPin, Calendar, LogOut } from "lucide-react";
import { GOLD, SURFACE, BORDER } from "../../constants";

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Turnos", path: "/admin" },
    { icon: Users, label: "Staff", path: "/admin/staff" },
    { icon: Star, label: "Servicios", path: "/admin/services" },
    { icon: MapPin, label: "Sucursales", path: "/admin/branches" },
    { icon: Calendar, label: "Horarios", path: "/admin/schedules" },
  ];

  return (
    <div className="flex min-h-screen bg-black font-sans">
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 hidden lg:flex flex-col">
        <div className="p-6 border-b border-zinc-800"><span className="text-white font-bold text-xl">Barber<span style={{color: GOLD}}>SaaS</span></span></div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
             <button key={item.path} onClick={() => navigate(item.path)} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors">
               <item.icon className="w-4 h-4" /> {item.label}
             </button>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800">
           <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-900/10 rounded-xl transition-colors"><LogOut className="w-4 h-4" /> Cerrar Sesión</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto"><Outlet /></main>
    </div>
  );
}