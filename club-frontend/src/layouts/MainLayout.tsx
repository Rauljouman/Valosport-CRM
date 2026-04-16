import React, { useState } from 'react';
import { Home, Users, Wallet, Settings, Menu, X } from 'lucide-react';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900">
        
        {/* BARRA SUPERIOR Movil*/}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
            <span className="font-bold text-emerald-800 text-xl">Qlubbo</span>
            <button onClick={() => setMenuAbierto(!menuAbierto)}>
            {menuAbierto ? <X /> : <Menu />}
            </button>
        </div>

        {/* SIDEBAR */}
        <aside className={`
            ${menuAbierto ? 'block' : 'hidden'} 
            md:block w-full md:w-64 bg-white border-r border-slate-200 flex flex-col
        `}>
            <div className="p-6 hidden md:flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-700 rounded-lg"></div>
            <span className="font-bold text-xl text-emerald-900">Qlubbo</span>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1">
            <NavItem icon={<Home size={20}/>} label="Incio" active />
            <NavItem icon={<Users size={20}/>} label="Géstion de jugadores" />
            <NavItem icon={<Wallet size={20}/>} label="Tesoreria" />
            <NavItem icon={<Settings size={20}/>} label="Configuración" />
            </nav>
        </aside>

        {/* CONTENIDO PRINCIPAL*/}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {children} 
        </main>
        </div>
  );
};
// Mini-componente para los botones del menú
const NavItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
    <button className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
        ${active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}
    `}>
        {icon}
        {label}
    </button>
);