import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import axiosClient from "../../api/axiosClient";
import CrearUsuarioModal from "./CrearUsuarioModal";
import { UserPlus, Trash2, Pencil  } from "lucide-react";
import EditarUsuarioModal from "./EditarUsuarioModal";

function UsuariosPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [crearOpen, setCrearOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const emailActual = useAuthStore((state) => state.email);
  const logout = useAuthStore((state) => state.logout);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosClient.get("/usuarios");
      setUsuarios(response.data ?? []);
    } catch (error) {
      console.error(error);
      setError("No se han podido cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const cambiarRol = async (usuarioId, nuevoRol, emailUsuario) => {
    try {
      await axiosClient.put(`/usuarios/${usuarioId}/rol`, {
        rol: nuevoRol,
      });

      if (emailUsuario === emailActual) {
        alert("Tu rol ha cambiado. Debes iniciar sesión de nuevo.");
        logout();
        window.location.href = "/login";
        return;
      }

      cargarUsuarios();
    } catch (error) {
      console.error(error);
      alert("No se ha podido cambiar el rol.");
    }
  };

  const confirmarEliminarUsuario = async () => {
    if (!usuarioAEliminar) return;

    try {
      setEliminando(true);

      await axiosClient.delete(`/usuarios/${usuarioAEliminar.id}`);

      setUsuarioAEliminar(null);
      cargarUsuarios();
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "No se ha podido eliminar el usuario."
      );
    } finally {
      setEliminando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Usuarios y roles
            </h2>
            <p className="text-sm text-slate-500">
              Gestiona los usuarios que pueden acceder al club.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCrearOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4ED4D4] px-4 py-2 text-sm font-black text-slate-900 hover:brightness-95"
          >
            <UserPlus className="h-4 w-4" />
            Nuevo usuario
          </button>
        </div>

        {error && (
          <div className="m-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-5 text-sm text-slate-500">
            Cargando usuarios...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Nombre</th>
                  <th className="px-5 py-3 font-bold">Email</th>
                  <th className="px-5 py-3 font-bold">Rol</th>
                  <th className="px-5 py-3 font-bold">Club</th>
                  <th className="px-5 py-3 font-bold text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {usuario.nombre}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {usuario.email}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={usuario.rol}
                          onChange={(e) =>
                            cambiarRol(usuario.id, e.target.value,usuario.email)
                          }
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-[#4ED4D4] focus:ring-2 focus:ring-[#4ED4D4]/20"
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="COORDINADOR">Coordinador</option>
                          <option value="TESORERO">Tesorero</option>
                        </select>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {usuario.clubNombre}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setUsuarioAEditar(usuario)}
                            title="Editar usuario"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-[#0F766E]"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          {usuario.email !== emailActual && usuario.rol !== "ADMIN" && (
                            <button
                              type="button"
                              onClick={() => setUsuarioAEliminar(usuario)}
                              title="Eliminar usuario"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-8 text-center text-slate-500"
                    >
                      No hay usuarios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
        
      {usuarioAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            onClick={() => setUsuarioAEliminar(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <section className="relative z-10 w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
            <h2 className="text-xl font-black text-slate-900">
              Eliminar usuario
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              ¿Seguro que quieres eliminar a{" "}
              <span className="font-bold text-slate-900">
                {usuarioAEliminar.nombre}
              </span>
              ? Esta acción no se puede deshacer.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setUsuarioAEliminar(null)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={eliminando}
                onClick={confirmarEliminarUsuario}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white hover:bg-red-700 disabled:opacity-60"
              >
                {eliminando ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </section>
        </div>
      )}

      <EditarUsuarioModal
        open={Boolean(usuarioAEditar)}
        onClose={() => setUsuarioAEditar(null)}
        usuario={usuarioAEditar}
        onUsuarioActualizado={cargarUsuarios}
      />
      
      <CrearUsuarioModal
        open={crearOpen}
        onClose={() => setCrearOpen(false)}
        onUsuarioCreado={cargarUsuarios}
      />
    </>
  );
}

export default UsuariosPanel;