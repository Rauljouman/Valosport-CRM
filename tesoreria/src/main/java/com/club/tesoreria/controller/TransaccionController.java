package com.club.tesoreria.controller;

import com.club.tesoreria.dto.CrearTransaccionDto;
import com.club.tesoreria.model.Transaccion;
import com.club.tesoreria.repository.TransaccionRepository;
import com.club.tesoreria.service.TesoreriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/transacciones")
public class TransaccionController {

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private TesoreriaService tesoreriaService;

    @GetMapping("/buscar")
    public List<Transaccion> filtrar(
            @RequestParam(required = false) String dni,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Double cantidad,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha
    ) {
        if (dni != null) {
            return transaccionRepository.findByJugador_Dni(dni);
        }

        if (nombre != null) {
            return transaccionRepository.findByJugador_NombreContainingIgnoreCase(nombre);
        }

        if (cantidad != null) {
            return transaccionRepository.findByCantidad(cantidad);
        }

        if (fecha != null) {
            LocalDateTime inicio = fecha.atStartOfDay();
            LocalDateTime fin = fecha.atTime(LocalTime.MAX);
            return transaccionRepository.findByFechaBetween(inicio, fin);
        }

        return transaccionRepository.findAll();
    }

    @PostMapping
    public Transaccion crear(@Valid @RequestBody CrearTransaccionDto request) {
        return tesoreriaService.registrarPago(request);
    }

    @GetMapping("/balance")
    public Double verBalanceTotal() {
        return tesoreriaService.obtenerBalance();
    }
}