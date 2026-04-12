package com.club.tesoreria.service;

import com.club.tesoreria.model.Transaccion;
import com.club.tesoreria.model.Usuario;
import com.club.tesoreria.repository.TransaccionRepository;
import com.club.tesoreria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TesoreriaService {

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /* * Esta función centraliza el registro de cualquier movimiento de dinero.
     * Aplica validaciones de seguridad y actualiza el saldo del jugador automáticamente.
     */
    @Transactional
    public Transaccion registrarPago(Transaccion transaccion) {

        // Valida que no se intenten registrar montos negativos o de cero euros
        if (transaccion.getCantidad() <= 0) {
            throw new RuntimeException("Error: La cantidad debe ser mayor a 0.");
        }

        // Verifica si la transacción tiene un usuario asociado (es un pago de socio/jugador)
        if (transaccion.getUsuario() != null && transaccion.getUsuario().getId() != null) {

            // Recupera los datos completos del usuario desde la BD para conocer su deuda actual
            Usuario usuario = usuarioRepository.findById(transaccion.getUsuario().getId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Regla de negocio: Impide que un jugador pague más dinero del que debe actualmente
            if (transaccion.getCantidad() > usuario.getSaldoPendiente()) {
                throw new RuntimeException("Error: El pago supera la deuda pendiente del jugador.");
            }


            // Resta el monto recibido del saldo pendiente del jugador en memoria
            usuario.setSaldoPendiente(usuario.getSaldoPendiente() - transaccion.getCantidad());

            // Guarda al usuario con su nuevo saldo actualizado en la base de datos
            usuarioRepository.save(usuario);
        }
        else {
            //El sistema no bloquea el pago aunque la cuenta quede negativa.
            System.out.println("Se ha registrado el movimiento " + transaccion.getTitulo());
        }

        // Registra la transacción en el historial de la tabla transacciones
        return transaccionRepository.save(transaccion);
    }

    public Double obtenerBalance(){
        double ingresosTotal = transaccionRepository.sumarIngreso();
        double retirosTotal = transaccionRepository.sumarRetiross();

        return ingresosTotal - retirosTotal;
    }
}