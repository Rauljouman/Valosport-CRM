function ConfiguracionPage() {
  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-3xl font-black text-slate-900">
          Configuración
        </h1>

        <p className="mt-1 text-slate-500">
          Gestiona la configuración del club y los usuarios.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-900">
          Usuarios y roles
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Próximamente podrás crear usuarios y asignar permisos.
        </p>
      </section>
    </div>
  );
}

export default ConfiguracionPage;