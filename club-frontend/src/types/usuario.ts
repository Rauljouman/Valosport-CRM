export interface Usuario {
  id: number;
  nombre: string;
  apellido: string; 
  email: string;
  telefono: string;
  cuotaAnual: number;
  saldoPendiente: number;
  rutaDocumento: string;
  rol: 'JUGADOR' | 'ADMIN' | 'ENTRENADOR'; 
  grupo?: {
    id: number;
    nombre: string;
  };
}