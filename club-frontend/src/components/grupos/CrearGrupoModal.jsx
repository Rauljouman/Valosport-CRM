import { useState } from "react";
import axiosClient from "../../api/axiosClient";

const formInicial = {
  nombre: "",
  categoria: "",
};

function CrearGrupoModal({ open, onClose, onGrupoCreado }) {
  const [form, setForm] = useState(formInicial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError("El nombre del grupo es obligatorio.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axiosClient.post("/grupos", {
        nombre: form.nombre,
        categoria: form.categoria,
      });

      setForm(formInicial);
      onGrupoCreado();
      onClose();
    } catch (err) {
      console.error(err);
      setError("No se ha podido crear el grupo.");
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
              Crear grupo
            </h2>
            <p className="text-sm text-slate-500">
              Añade un nuevo equipo al club.
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

          <label className="flex flex-col gap-1">
            <span className="text-xs font-black uppercase tracking-wide text-slate-500">
              Nombre del grupo
            </span>
            <input
              value={form.nombre}
              onChange={(e) => actualizarCampo("nombre", e.target.value)}
              placeholder="Senior A"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4ED4D4] focus:ring-2 focus:ring-[#4ED4D4]/20"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-black uppercase tracking-wide text-slate-500">
              Categoría
            </span>
            <input
              value={form.categoria}
              onChange={(e) => actualizarCampo("categoria", e.target.value)}
              placeholder="Senior, Juvenil, Cadete..."
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4ED4D4] focus:ring-2 focus:ring-[#4ED4D4]/20"
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
              {loading ? "Creando..." : "Crear grupo"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CrearGrupoModal;