import { useEffect, useState } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { StatCard } from './components/StatCard';
import { getBalanceTotal, getUsuarios } from './services/usuarioService'; // Usamos los servicios que creamos
import { Usuario } from './types/usuario';
import { TrendingUp, AlertCircle, Users } from 'lucide-react';

function App() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [balance, setBalance] = useState<number>(0);

  // Cargamos todo al iniciar
  useEffect(() => {
    // 1. Cargar Usuarios
    getUsuarios()
      .then(data => setUsuarios(data))
      .catch(err => console.error("Error usuarios:", err));

    // 2. Cargar Balance
    getBalanceTotal()
      .then(data => setBalance(data))
      .catch(err => console.error("Error balance:", err));
  }, []);

  const deudaTotal = usuarios.reduce((acc, u) => acc + (u.saldoPendiente || 0), 0);
  const sociosConDeuda = usuarios.filter(u => u.saldoPendiente > 0).length;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-800">QLUBBO</h1>
        </header>

        {/* --- LAS TARJETAS (StatCards) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Saldo en Cuenta" 
            value={`${balance}€`} 
            icon={<TrendingUp size={20} />} 
            color={balance < 0 ? "red" : "black"}
            subtitle="+12.4% vs mes anterior"
          />
          <StatCard 
            title="Socios Activos" 
            value={`${usuarios.length}`} 
            icon={<Users size={20} />} 
            subtitle="Temporada 2025/26"
          />
          <StatCard 
            title="Deuda Total" 
            value={`${deudaTotal}€`} 
            icon={<AlertCircle size={20} />} 
            color="red"
            subtitle={`${sociosConDeuda} socios pendientes`}
          />
        </div>

        {/* --- LA LISTA DE SOCIOS --- */}
        <h2 className="text-xl font-bold mb-4 text-slate-700">Listado de Socios</h2>
        <div className="grid gap-4">
          {usuarios.length > 0 ? (
            usuarios.map(u => (
              <div key={u.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md transition-shadow">
                <div>
                  <p className="font-bold text-lg text-slate-800">{u.nombre} {u.apellido}</p>
                  <p className="text-sm text-slate-500 uppercase tracking-tight">
                    {u.rol} • {u.grupo?.nombre || 'Sin equipo'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Saldo Pendiente</p>
                  <p className={`text-xl font-bold ${u.saldoPendiente > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {u.saldoPendiente > 0 ? `${u.saldoPendiente}€` : '0'}€
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-200 animate-pulse h-20 rounded-2xl flex items-center justify-center">
              <p className="text-slate-500">Conectando con el servidor de Qlubbo...</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default App;