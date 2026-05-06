package com.club.tesoreria.service;

import com.club.tesoreria.model.Jugador;
import com.club.tesoreria.model.TipoTransaccion;
import com.club.tesoreria.model.TipoTransaccionOrigen;
import com.club.tesoreria.model.Transaccion;
import com.club.tesoreria.repository.JugadorRepository;
import com.club.tesoreria.repository.TransaccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TesoreriaService {

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private JugadorRepository jugadorRepository;

    @Transactional
    public Transaccion registrarPago(Transaccion transaccion) {

        if (transaccion.getCantidad() == null || transaccion.getCantidad() <= 0) {
            throw new IllegalArgumentException("Error: La cantidad debe ser mayor a 0.");
        }

        if (transaccion.getTipo() == null) {
            throw new IllegalArgumentException("Error: debes indicar el tipo de transacción.");
        }

        if (transaccion.getOrigen() == null) {
            throw new IllegalArgumentException("Error: debes indicar el origen de la transacción.");
        }

        double saldoActual = obtenerBalance();
        double saldoNuevo;

        if (transaccion.getTipo() == TipoTransaccion.RETIRO) {
            saldoNuevo = saldoActual - transaccion.getCantidad();
        } else if (transaccion.getTipo() == TipoTransaccion.INGRESO) {
            saldoNuevo = saldoActual + transaccion.getCantidad();
        } else {
            throw new IllegalArgumentException("Error: tipo de transacción no válido.");
        }

        transaccion.setSaldoGeneralDespues(saldoNuevo);

        if (transaccion.getOrigen() == TipoTransaccionOrigen.JUGADOR) {

            if (transaccion.getTipo() != TipoTransaccion.INGRESO) {
                throw new IllegalArgumentException("Error: una transacción de jugador debe ser de tipo INGRESO.");
            }

            if (transaccion.getJugador() == null || transaccion.getJugador().getId() == null) {
                throw new IllegalArgumentException("Error: debes indicar el jugador.");
            }

            Jugador jugador = jugadorRepository.findById(transaccion.getJugador().getId())
                    .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

            if (transaccion.getCantidad() > jugador.getSaldoPendiente()) {
                throw new IllegalArgumentException("Error: El pago supera la deuda pendiente del jugador.");
            }

            Double nuevoSaldoJugador = jugador.getSaldoPendiente() - transaccion.getCantidad();

            jugador.setSaldoPendiente(nuevoSaldoJugador);
            jugadorRepository.save(jugador);

            transaccion.setSaldoJugadorDespues(nuevoSaldoJugador);
            transaccion.setJugador(jugador);

        } else {
            transaccion.setJugador(null);
            transaccion.setSaldoJugadorDespues(null);
        }

        return transaccionRepository.save(transaccion);
    }

    public Double obtenerBalance() {
        Double ingresosTotal = transaccionRepository.sumarIngreso();
        Double retirosTotal = transaccionRepository.sumarRetiros();

        if (ingresosTotal == null) {
            ingresosTotal = 0.0;
        }

        if (retirosTotal == null) {
            retirosTotal = 0.0;
        }
        
    
        return ingresosTotal - retirosTotal;
    }
}