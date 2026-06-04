import { CircleUserRound } from "lucide-react";
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-stretch">
        <section className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4ED4D4]/15 text-[#0F766E]">
              <CircleUserRound size={22} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Información de la cuenta
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Consulta los datos principales asociados a tu usuario.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">
                Nombre
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {nombre || "No disponible"}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-slate-400">
                Email
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {email || "No disponible"}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-slate-400">
                Rol
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {rol || "No disponible"}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-slate-400">
                Club
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {clubNombre || "No disponible"}
              </p>
            </div>
          </div>
        </section>

        <CambiarPasswordPanel />
      </div>
    </div>
  );
}

export default MiCuentaPage;