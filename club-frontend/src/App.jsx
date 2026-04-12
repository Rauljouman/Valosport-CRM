import { useEffect, useState } from 'react'
import './index.css'

function App() {
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    // Asegúrate de que tu IntelliJ tiene el server de Spring corriendo
    fetch('http://localhost:8080/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error("Error al conectar con Java:", err))
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-indigo-600 mb-2">CLUB MANAGER PRO</h1>
        <p className="text-slate-500 mb-8">Sprint 5: Frontend Conectado</p>

        <div className="grid gap-4">
          {usuarios.length > 0 ? (
            usuarios.map(u => (
              <div key={u.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-500 flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg text-slate-800">{u.nombre} {u.apellido}</p>
                  <p className="text-sm text-slate-500">{u.rol} • {u.grupo?.nombre || 'Sin equipo'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Saldo Pendiente</p>
                  <p className={`font-mono font-bold ${u.saldoPendiente > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {u.saldoPendiente}€
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-700">
              No hay usuarios o el Backend está apagado.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App