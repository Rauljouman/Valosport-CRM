import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuthStore } from "../../store/authStore";

const formInicial = {
  nombre: "",
  ciudad: "",
};

function EditarClubModal({ open, onClose, onClubActualizado }) {
  const [form, setForm] = useState(formInicial);
  const [loading, setLoading] = useState(false);
  const [loadingClub, setLoadingClub] = useState(false);
  const [error, setError] = useState("");
  const setClubNombre = useAuthStore((state) => state.setClubNombre);

  useEffect(() => {
    if (open) cargarClub();
  }, [open]);

  const cargarClub = async () => {
    try {
      setLoadingClub(true);
      setError("");

      const response = await axiosClient.get("/clubes/actual");

      setForm({
        nombre: response.data?.nombre ?? "",
        ciudad: response.data?.ciudad ?? "",
      });
    } catch (error) {
      console.error(error);
      setError("No se han podido cargar los datos del club.");
    } finally {
      setLoadingClub(false);
    }
  };

  if (!open) return null;

  const actualizarCampo = (campo, valor) => {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      setError("El nombre del club es obligatorio.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axiosClient.put("/clubes/actual", {
        nombre: form.nombre,
        ciudad: form.ciudad,
      });
      setClubNombre(form.nombre);
      onClubActualizado?.();
      onClose();
    } catch (error) {
      console.error(error);
      setError("No se ha podido actualizar el club.");
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

      <section className="relative z-10 w-full max-w-md rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Editar club
            </h2>

            <p className="text-sm text-slate-500">
              Modifica los datos principales del club.
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

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {loadingClub ? (
            <p className="text-sm text-slate-500">Cargando datos del club...</p>
          ) : (
            <>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Nombre del club
                </span>

                <input
                  value={form.nombre}
                  onChange={(e) => actualizarCampo("nombre", e.target.value)}
                  placeholder="Atlètic Les Corts"
                  className={inputClass}
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Ciudad
                </span>

                <input
                  value={form.ciudad}
                  onChange={(e) => actualizarCampo("ciudad", e.target.value)}
                  placeholder="Barcelona"
                  className={inputClass}
                />
              </label>

              <div className="flex gap-3 pt-2">
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
                  {loading ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </>
          )}
        </form>
      </section>
    </div>
  );
}

const inputClass =
  "rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4ED4D4] focus:ring-2 focus:ring-[#4ED4D4]/20";

export default EditarClubModal;