import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

const formInicial = {
  dni: "",
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  direccion: "",
  fechaNacimiento: "",
  cuotaAnual: "",
  rutaDocumento: "",
  rol: "JUGADOR",
  estatus: "ACTIVO",
  grupoId: "",
};

function CrearJugadorModal({ open, onClose, onJugadorCreado }) {
  const [form, setForm] = useState(formInicial);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fecha, setFecha] = useState({dia: "", mes: "", anio: "",});

  useEffect(() => {
    if (open) cargarGrupos();
  }, [open]);

  const cargarGrupos = async () => {
    try {
      const response = await axiosClient.get("/grupos");
      setGrupos(response.data ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  const actualizarFecha = (campo, valor) => {
  const nuevaFecha = {
      ...fecha,
      [campo]: valor,
    };

    setFecha(nuevaFecha);

    const { dia, mes, anio } = nuevaFecha;

    if (dia && mes && anio) {
      const diaFormateado = String(dia).padStart(2, "0");
      const mesFormateado = String(mes).padStart(2, "0");

      actualizarCampo(
        "fechaNacimiento",
        `${anio}-${mesFormateado}-${diaFormateado}`
      );
    }
  };

  if (!open) return null;

  const actualizarCampo = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.dni.trim()) return setError("El DNI es obligatorio.");
    if (form.dni.trim().length > 9) {
      return setError("El DNI no puede tener más de 9 caracteres.");
    }

    if (!form.nombre.trim()) return setError("El nombre es obligatorio.");
    if (!form.apellido.trim()) return setError("El apellido es obligatorio.");

    if (!form.email.trim()) return setError("El email es obligatorio.");
    if (!form.email.includes("@")) {
      return setError("El email debe contener @.");
    }

    if (!form.telefono.trim()) return setError("El teléfono es obligatorio.");
    if (form.telefono.trim().length > 9) {
      return setError("El teléfono no puede tener más de 9 caracteres.");
    }

    if (!form.direccion.trim()) return setError("La dirección es obligatoria.");
    if (!form.fechaNacimiento) {
      return setError("La fecha de nacimiento es obligatoria.");
    }

    if (!form.cuotaAnual) return setError("La cuota anual es obligatoria.");
    if (Number(form.cuotaAnual) < 0) {
      return setError("La cuota anual no puede ser negativa.");
    }

    if (!form.grupoId) return setError("Debes seleccionar un grupo.");

    try {
      setLoading(true);
      setError("");

      await axiosClient.post("/jugadores", {
        ...form,
        cuotaAnual: Number(form.cuotaAnual),
        rutaDocumento: "",
        grupoId: Number(form.grupoId),
      });

      setForm(formInicial);
      setFecha({ dia: "", mes: "", anio: "" });
      onJugadorCreado?.();
      onClose();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "No se ha podido crear el jugador."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      <section className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Crear jugador</h2>
            <p className="text-sm text-slate-500">
              Registra un nuevo jugador en el club.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-2xl text-slate-500 hover:bg-slate-100"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[75vh] space-y-5 overflow-y-auto p-5">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Campo label="DNI">
              <input
                maxLength={9}
                className={inputClass}
                value={form.dni}
                onChange={(e) => actualizarCampo("dni", e.target.value)}
              />
            </Campo>

            <Campo label="Nombre">
              <input className={inputClass} value={form.nombre} onChange={(e) => actualizarCampo("nombre", e.target.value)} />
            </Campo>

            <Campo label="Apellidos">
              <input className={inputClass} value={form.apellido} onChange={(e) => actualizarCampo("apellido", e.target.value)} />
            </Campo>

            <Campo label="Email">
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => actualizarCampo("email", e.target.value)}
              />
            </Campo>

            <Campo label="Teléfono">
              <input
                maxLength={9}
                className={inputClass}
                value={form.telefono}
                onChange={(e) => actualizarCampo("telefono", e.target.value)}
              />
            </Campo>

            <Campo label="Fecha nacimiento">
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Día"
                  min="1"
                  max="31"
                  className={inputClass}
                  value={fecha.dia}
                  onChange={(e) => actualizarFecha("dia", e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Mes"
                  min="1"
                  max="12"
                  className={inputClass}
                  value={fecha.mes}
                  onChange={(e) => actualizarFecha("mes", e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Año"
                  min="1900"
                  className={inputClass}
                  value={fecha.anio}
                  onChange={(e) => actualizarFecha("anio", e.target.value)}
                />
              </div>
            </Campo>

            <Campo label="Dirección">
              <input className={inputClass} value={form.direccion} onChange={(e) => actualizarCampo("direccion", e.target.value)} />
            </Campo>

            <Campo label="Cuota anual">
              <input
                type="number"
                min="0"
                className={inputClass}
                value={form.cuotaAnual}
                onChange={(e) => actualizarCampo("cuotaAnual", e.target.value)}
              />
            </Campo>

            <Campo label="Grupo">
              <select className={inputClass} value={form.grupoId} onChange={(e) => actualizarCampo("grupoId", e.target.value)}>
                <option value="">Seleccionar grupo</option>
                {grupos.map((grupo) => (
                  <option key={grupo.id} value={grupo.id}>
                    {grupo.nombre} {grupo.categoria ? `- ${grupo.categoria}` : ""}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo label="Rol">
              <select className={inputClass} value={form.rol} onChange={(e) => actualizarCampo("rol", e.target.value)}>
                <option value="JUGADOR">Jugador</option>
                <option value="PORTERO">Portero</option>
              </select>
            </Campo>

            <Campo label="Estado">
              <select className={inputClass} value={form.estatus} onChange={(e) => actualizarCampo("estatus", e.target.value)}>
                <option value="ACTIVO">Activo</option>
                <option value="LESIONADO">Lesionado</option>
                <option value="SUSPENDIDO">Suspendido</option>
              </select>
            </Campo>
          </div>

          <div className="flex gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#4ED4D4] px-4 py-2 text-sm font-black text-slate-900 hover:brightness-95 disabled:opacity-60"
            >
              {loading ? "Creando..." : "Crear jugador"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4ED4D4] focus:ring-2 focus:ring-[#4ED4D4]/20";

export default CrearJugadorModal;