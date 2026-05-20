function UnauthorizedPage() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <h1 className="text-2xl font-black text-slate-900 mb-2">
        Acceso no autorizado
      </h1>
      <p className="text-slate-600">
        No tienes permisos para acceder a esta sección. Contacta con un
        administrador del club si necesitas acceso.
      </p>
    </div>
  );
}

export default UnauthorizedPage;