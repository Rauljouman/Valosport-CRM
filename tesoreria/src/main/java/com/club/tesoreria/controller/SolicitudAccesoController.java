package com.club.tesoreria.controller;

import com.club.tesoreria.dto.SolicitudAccesoDto;
import com.club.tesoreria.service.SolicitudAccesoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/solicitudes-acceso")
@RequiredArgsConstructor
public class SolicitudAccesoController {

    private final SolicitudAccesoService solicitudAccesoService;

    @PostMapping
    public String solicitarAcceso(@Valid @RequestBody SolicitudAccesoDto request) {
        solicitudAccesoService.enviarSolicitud(request);
        return "Solicitud enviada correctamente.";
    }
}