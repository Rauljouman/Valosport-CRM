import { useState } from "react";
import axiosClient from "../../api/axiosClient";

const formInicial = {
  nombre: "",
  email: "",
  password: "",
  rol: "TESORERO",
};

function CrearUsuarioModal({ open, onClose, onUsuarioCreado }) {
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

    if (!form.nombre.trim()) return setError("El nombre es obligatorio.");
    if (!form.email.trim()) return setError("El email es obligatorio.");
    if (!form.email.includes("@")) return setError("El email debe contener @.");
    if (!form.password.trim()) return setError("La contraseña es obligatoria.");
    if (form.password.length < 6) {
      return setError("La contraseña debe tener mínimo 6 caracteres.");
    }

    try {
      setLoading(true);
      setError("");

      await axiosClient.post("/usuarios", form);

      setForm(formInicial);
      onUsuarioCreado?.();
      onClose();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "No se ha podido crear el usuario."
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

      <section className="relative z-10 w-full max-w-md rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Crear usuario
            </h2>
            <p className="text-sm text-slate-500">
              Añade un usuario al club actual.
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

          <Campo label="Nombre">
            <input
              value={form.nombre}
              onChange={(e) => actualizarCampo("nombre", e.target.value)}
              className={inputClass}
              placeholder="Nombre del usuario"
            />
          </Campo>

          <Campo label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => actualizarCampo("email", e.target.value)}
              className={inputClass}
              placeholder="usuario@email.com"
            />
          </Campo>

          <Campo label="Contraseña temporal">
            <input
              type="password"
              value={form.password}
              onChange={(e) => actualizarCampo("password", e.target.value)}
              className={inputClass}
              placeholder="Mínimo 6 caracteres"
            />
          </Campo>

          <Campo label="Rol">
            <select
              value={form.rol}
              onChange={(e) => actualizarCampo("rol", e.target.value)}
              className={inputClass}
            >
              <option value="ADMIN">Admin</option>
              <option value="COORDINADOR">Coordinador</option>
              <option value="TESORERO">Tesorero</option>
            </select>
          </Campo>

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
              {loading ? "Creando..." : "Crear usuario"}
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

export default CrearUsuarioModal;