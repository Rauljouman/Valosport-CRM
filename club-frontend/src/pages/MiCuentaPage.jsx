import CambiarPasswordPanel from "../components/configuracion/CambiarPasswordPanel";
import { useAuthStore } from "../store/authStore";

function MiCuentaPage() {
  const nombre = useAuthStore((state) => state.nombre);
  const email = useAuthStore((state) => state.email);
  const rol = useAuthStore((state) => state.rol);
  const clubNombre = useAuthStore((state) => state.clubNombre);

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-3xl font-black text-slate-900">Mi cuenta</h1>
        <p className="mt-1 text-sm text-slate-500">
          Gestiona los datos básicos de tu cuenta y tu contraseña.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-900 mb-4">
          Información de la cuenta
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Nombre</p>
            <p className="text-sm font-semibold text-slate-800">{nombre}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Email</p>
            <p className="text-sm font-semibold text-slate-800">{email}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Rol</p>
            <p className="text-sm font-semibold text-slate-800">{rol}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Club</p>
            <p className="text-sm font-semibold text-slate-800">{clubNombre}</p>
          </div>
        </div>
      </section>

      <CambiarPasswordPanel />
    </div>
  );
}

export default MiCuentaPage;