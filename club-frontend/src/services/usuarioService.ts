import clienteAxios from '../api/clienteAxios';
import { Usuario } from '../types/usuario';

export const getUsuarios = async (): Promise<Usuario[]> => {
  const respuesta = await clienteAxios.get<Usuario[]>('/usuarios');
  return respuesta.data;
};

export const getBalanceTotal = async (): Promise<number> => {
  const respuesta = await clienteAxios.get<number>('/transacciones/balance');
  return respuesta.data;
};