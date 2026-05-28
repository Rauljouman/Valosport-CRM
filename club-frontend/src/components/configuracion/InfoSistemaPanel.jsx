import { useEffect, useState } from "react";
import { Info, Users, Shield, Trophy, Layers, ReceiptText } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import { useAuthStore } from "../../store/authStore";

function InfoSistemaPanel() {
  const clubNombre = useAuthStore((state) => state.clubNombre);
  const rol = useAuthStore((state) => state.rol);

  const [datos, setDatos] = useState({
    usuarios: 0,
    jugadores: 0,
    grupos: 0,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [usuariosRes, jugadoresRes, gruposRes, transaccionesRes] =
          await Promise.all([
            axiosClient.get("/usuarios"),
            axiosClient.get("/jugadores"),
            axiosClient.get("/grupos"),
            axiosClient.get("/transacciones/filtrar?page=0&size=1"),
          ]);

        setDatos({
          usuarios: usuariosRes.data?.length ?? 0,
          jugadores: jugadoresRes.data?.length ?? 0,
          grupos: gruposRes.data?.length ?? 0,
          transacciones: transaccionesRes.data?.totalElements ?? 0,
        });
      } catch (error) {
        console.error(error);
      }
    };

  cargarDatos();
}, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4ED4D4]/15 text-[#0F766E]">
          <Info className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-900">
            Información del sistema
          </h2>
          <p className="text-sm text-slate-500">
            Resumen general del entorno actual.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <InfoBox icon={<Trophy className="h-4 w-4" />} label="Club" value={clubNombre} />
        <InfoBox icon={<Shield className="h-4 w-4" />} label="Rol actual" value={rol} />
        <InfoBox icon={<Users className="h-4 w-4" />} label="Usuarios" value={datos.usuarios} />
        <InfoBox icon={<Users className="h-4 w-4" />} label="Jugadores" value={datos.jugadores} />
        <InfoBox icon={<Layers className="h-4 w-4" />} label="Grupos" value={datos.grupos} />
        <InfoBox icon={<ReceiptText className="h-4 w-4" />} label="Transacciones" value={datos.transacciones} />
      </div>
    </section>
  );
}

function InfoBox({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#0F766E]">
        {icon}
      </div>
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black text-slate-900">
        {value || "—"}
      </p>
    </div>
  );
}

export default InfoSistemaPanel;