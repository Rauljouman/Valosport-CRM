package com.club.tesoreria.service;

import com.club.tesoreria.model.Transaccion;
import com.club.tesoreria.model.Usuario;
import com.club.tesoreria.repository.TransaccionRepository;
import com.club.tesoreria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TesoreriaService {

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Registra el movimiento y, si es un pago de socio, le descuenta la deuda automáticamente.
    @Transactional 
    public Transaccion registrarPago(Transaccion transaccion) {

        // Bloquea cualquier intento de meter cantidades negativas o a cero.
        if (transaccion.getCantidad() <= 0) {
            throw new RuntimeException("La cantidad debe ser positiva.");
        }

        // Si el movimiento tiene un socio asignado, actualizamos su estado financiero.
        if (transaccion.getUsuario() != null && transaccion.getUsuario().getId() != null) {

            Usuario usuario = usuarioRepository.findById(transaccion.getUsuario().getId())
                    .orElseThrow(() -> new RuntimeException("Socio no encontrado."));

            // No permitimos que el socio pague más de lo que debe para evitar saldos a favor.
            if (transaccion.getCantidad() > usuario.getSaldoPendiente()) {
                throw new RuntimeException("El pago excede la deuda actual.");
            }

            // Resta el pago de la deuda pendiente y guarda al socio actualizado.
            usuario.setSaldoPendiente(usuario.getSaldoPendiente() - transaccion.getCantidad());
            usuarioRepository.save(usuario);
        }

        // Guarda el registro de la transacción (el "ticket") en la base de datos.
        return transaccionRepository.save(transaccion);
    }

    // Hace la suma de todos los ingresos y le resta los gastos para darnos el neto.
    public Double obtenerBalance(){
        double ingresosTotal = transaccionRepository.sumarIngreso();
        double retirosTotal = transaccionRepository.sumarRetiross();
        return ingresosTotal - retirosTotal;
    }
}