package com.club.tesoreria.controller;

import com.club.tesoreria.model.Transaccion;
import com.club.tesoreria.repository.TransaccionRepository;
import com.club.tesoreria.service.TesoreriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/transacciones")
@CrossOrigin(origins = "http://localhost:5173")
public class TransaccionController {

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private TesoreriaService tesoreriaService;

    /* * Endpoint de búsqueda avanzado: permite filtrar por los criterios solicitados.
     * Prioriza los filtros en orden: DNI > Nombre > Cantidad > Fecha.
     */
    @GetMapping("/buscar")
    public List<Transaccion> filtrar(
            @RequestParam(required = false) String dni,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Double cantidad,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha
    ) {
        // Busca por el DNI del jugador asociado
        if (dni != null) {
            return transaccionRepository.findByUsuario_Dni(dni);
        }

        // Busca por nombre (o parte del nombre) del jugador
        if (nombre != null) {
            return transaccionRepository.findByUsuario_NombreContainingIgnoreCase(nombre);
        }

        // Busca transacciones por un importe exacto
        if (cantidad != null) {
            return transaccionRepository.findByCantidad(cantidad);
        }

        // Busca todas las transacciones ocurridas en una fecha concreta
        if (fecha != null) {
            LocalDateTime inicio = fecha.atStartOfDay();
            LocalDateTime fin = fecha.atTime(LocalTime.MAX);
            return transaccionRepository.findByFechaBetween(inicio, fin);
        }

        // Si no hay filtros, devuelve todo el historial
        return transaccionRepository.findAll();
    }

    @GetMapping("/balance")
    public Double verBalanceTotal(){
        return tesoreriaService.obtenerBalance();
    }
}