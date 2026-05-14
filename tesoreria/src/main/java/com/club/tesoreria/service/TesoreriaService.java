package com.club.tesoreria.service;

import com.club.tesoreria.dto.TransaccionFiltroDto;
import com.club.tesoreria.dto.TransaccionCrearDto;
import com.club.tesoreria.dto.TransaccionResponseDto;
import com.club.tesoreria.model.Jugador;
import com.club.tesoreria.model.TipoTransaccion;
import com.club.tesoreria.model.TipoTransaccionOrigen;
import com.club.tesoreria.model.Transaccion;
import com.club.tesoreria.model.Club;
import com.club.tesoreria.repository.JugadorRepository;
import com.club.tesoreria.repository.TransaccionRepository;
import com.club.tesoreria.security.AuthenticatedUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.club.tesoreria.specification.TransaccionSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class TesoreriaService {

    @Autowired
    private AuthenticatedUserService authenticatedUserService;

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private JugadorRepository jugadorRepository;

    @Transactional
    public TransaccionResponseDto registrarPago(TransaccionCrearDto request) {

        if (request.getCantidad() == null || request.getCantidad() <= 0) {
            throw new IllegalArgumentException("Error: La cantidad debe ser mayor a 0.");
        }

        if (request.getTipo() == null) {
            throw new IllegalArgumentException("Error: debes indicar el tipo de transacción.");
        }

        if (request.getOrigen() == null) {
            throw new IllegalArgumentException("Error: debes indicar el origen de la transacción.");
        }

        if (request.getOrigen() == TipoTransaccionOrigen.JUGADOR) {

            if (request.getTipo() != TipoTransaccion.INGRESO) {
                throw new IllegalArgumentException("Error: una transacción de jugador debe ser de tipo INGRESO.");
            }

            if (request.getJugadorId() == null) {
                throw new IllegalArgumentException("Error: debes indicar el jugador.");
            }
        }

        Club club = authenticatedUserService.getUsuarioActual().getClub();

        Transaccion transaccion = new Transaccion();
        transaccion.setTitulo(request.getTitulo());
        transaccion.setDescripcion(request.getDescripcion());
        transaccion.setCantidad(request.getCantidad());
        transaccion.setTipo(request.getTipo());
        transaccion.setOrigen(request.getOrigen());
        transaccion.setCategoria(request.getCategoria());
        transaccion.setClub(club);

        double saldoActual = obtenerBalanceClub(club.getId());
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

            Jugador jugador = jugadorRepository.findById(request.getJugadorId())
                    .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

            if (!jugador.getClub().getId().equals(club.getId())) {
                throw new IllegalArgumentException("Error: el jugador no pertenece al club indicado.");
            }

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

        Transaccion transaccionGuardada = transaccionRepository.save(transaccion);
        return convertirAResponseDto(transaccionGuardada);
    }

    private TransaccionResponseDto convertirAResponseDto(Transaccion transaccion) {

        Long jugadorId = null;
        String jugadorNombre = null;

        if (transaccion.getJugador() != null) {
            jugadorId = transaccion.getJugador().getId();
            jugadorNombre = transaccion.getJugador().getNombre() + " " + transaccion.getJugador().getApellido();
        }

        return new TransaccionResponseDto(
                transaccion.getId(),
                transaccion.getTitulo(),
                transaccion.getDescripcion(),
                transaccion.getCantidad(),
                transaccion.getFecha(),
                transaccion.getTipo(),
                transaccion.getOrigen(),
                transaccion.getCategoria(),
                transaccion.getSaldoJugadorDespues(),
                transaccion.getSaldoGeneralDespues(),
                jugadorId,
                jugadorNombre,
                transaccion.getClub().getId(),
                transaccion.getClub().getNombre()
        );
    }

    public Page<TransaccionResponseDto> filtrarTransacciones(TransaccionFiltroDto filtro, Pageable pageable) {
    
        Long clubId = authenticatedUserService.getClubIdActual();

        return transaccionRepository.findAll(
            TransaccionSpecification.filtrar(filtro, clubId),
            pageable)
            .map(this::convertirAResponseDto);
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

    public Double obtenerBalanceClubUsuarioActual() {
        Long clubId = authenticatedUserService.getClubIdActual();
        return obtenerBalanceClub(clubId);
    }

    public Double obtenerBalanceClub(Long clubId) {
        Double ingresosTotal = transaccionRepository.sumarIngresoClub(clubId);
        Double retirosTotal = transaccionRepository.sumarRetirosClub(clubId);

        if (ingresosTotal == null) {
            ingresosTotal = 0.0;
        }

        if (retirosTotal == null) {
            retirosTotal = 0.0;
        }
        return ingresosTotal - retirosTotal;
    }
}