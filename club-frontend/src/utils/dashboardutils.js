export const crearMesesBase = (meses) => {
  const hoy = new Date();
  const resultado = [];

  for (let i = meses - 1; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);

    const key = `${fecha.getFullYear()}-${String(
      fecha.getMonth() + 1
    ).padStart(2, "0")}`;

    const labelRaw = fecha.toLocaleDateString("es-ES", {
      month: "short",
      year: "numeric",
    });

    const label = labelRaw.charAt(0).toUpperCase() + labelRaw.slice(1);

    resultado.push({
      key,
      mes: label,
      ingresosJugadores: 0,
      ingresosClub: 0,
      gastos: 0,
    });
  }

  return resultado;
};