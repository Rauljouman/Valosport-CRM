package com.club.tesoreria.service;

import com.club.tesoreria.dto.CrearTransaccionDto;
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
    public Transaccion registrarPago(CrearTransaccionDto request) {

        if (request.getCantidad() == null || request.getCantidad() <= 0) {
            throw new IllegalArgumentException("Error: La cantidad debe ser mayor a 0.");
        }

        if (request.getTipo() == null) {
            throw new IllegalArgumentException("Error: debes indicar el tipo de transacción.");
        }

        if (request.getOrigen() == null) {
            throw new IllegalArgumentException("Error: debes indicar el origen de la transacción.");
        }

        Transaccion transaccion = new Transaccion();
        transaccion.setTitulo(request.getTitulo());
        transaccion.setDescripcion(request.getDescripcion());
        transaccion.setCantidad(request.getCantidad());
        transaccion.setTipo(request.getTipo());
        transaccion.setOrigen(request.getOrigen());
        transaccion.setCategoria(request.getCategoria());

        double saldoActual = obtenerBalance();
        double saldoNuevo;

        if (request.getTipo() == TipoTransaccion.RETIRO) {
            saldoNuevo = saldoActual - request.getCantidad();
        } else if (request.getTipo() == TipoTransaccion.INGRESO) {
            saldoNuevo = saldoActual + request.getCantidad();
        } else {
            throw new IllegalArgumentException("Error: tipo de transacción no válido.");
        }

        transaccion.setSaldoGeneralDespues(saldoNuevo);

        if (request.getOrigen() == TipoTransaccionOrigen.JUGADOR) {

            if (request.getTipo() != TipoTransaccion.INGRESO) {
                throw new IllegalArgumentException("Error: una transacción de jugador debe ser de tipo INGRESO.");
            }

            if (request.getJugadorId() == null) {
                throw new IllegalArgumentException("Error: debes indicar el jugador.");
            }

            Jugador jugador = jugadorRepository.findById(request.getJugadorId())
                    .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

            if (request.getCantidad() > jugador.getSaldoPendiente()) {
                throw new IllegalArgumentException("Error: El pago supera la deuda pendiente del jugador.");
            }

            Double nuevoSaldoJugador = jugador.getSaldoPendiente() - request.getCantidad();

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