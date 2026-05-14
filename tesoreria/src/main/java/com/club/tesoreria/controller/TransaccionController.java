package com.club.tesoreria.controller;

import com.club.tesoreria.dto.TransaccionCrearDto;
import com.club.tesoreria.dto.TransaccionFiltroDto;
import com.club.tesoreria.dto.TransaccionResponseDto;
import com.club.tesoreria.model.TipoTransaccion;
import com.club.tesoreria.model.TipoTransaccionCategoria;
import com.club.tesoreria.model.TipoTransaccionOrigen;
import com.club.tesoreria.service.TesoreriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/transacciones")
public class TransaccionController {

    @Autowired
    private TesoreriaService tesoreriaService;

    @GetMapping("/filtrar")
    @PreAuthorize("hasAnyRole('ADMIN', 'TESORERO')")
    public Page<TransaccionResponseDto> filtrarTransacciones(
            @RequestParam(required = false) TipoTransaccion tipo,
            @RequestParam(required = false) TipoTransaccionOrigen origen,
            @RequestParam(required = false) TipoTransaccionCategoria categoria,
            @RequestParam(required = false) Long jugadorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaDesde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaHasta,
            @RequestParam(required = false) Double cantidadMin,
            @RequestParam(required = false) Double cantidadMax,
            @RequestParam(required = false) String titulo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        TransaccionFiltroDto filtro = new TransaccionFiltroDto();

        filtro.setTipo(tipo);
        filtro.setOrigen(origen);
        filtro.setCategoria(categoria);
        filtro.setJugadorId(jugadorId);
        filtro.setFechaDesde(fechaDesde);
        filtro.setFechaHasta(fechaHasta);
        filtro.setCantidadMin(cantidadMin);
        filtro.setCantidadMax(cantidadMax);
        filtro.setTitulo(titulo);

        Pageable pageable = PageRequest.of(page, size);

        return tesoreriaService.filtrarTransacciones(filtro, pageable);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TESORERO')")
    public TransaccionResponseDto crear(@Valid @RequestBody TransaccionCrearDto request) {
        return tesoreriaService.registrarPago(request);
    }

    @GetMapping("/balance")
    @PreAuthorize("hasAnyRole('ADMIN', 'TESORERO')")
    public Double verBalanceTotalClub() {
        return tesoreriaService.obtenerBalanceClubUsuarioActual();
    }
}