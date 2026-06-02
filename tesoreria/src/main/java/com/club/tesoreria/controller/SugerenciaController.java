package com.club.tesoreria.controller;

import com.club.tesoreria.dto.SugerenciaDto;
import com.club.tesoreria.service.SugerenciaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sugerencias")
@RequiredArgsConstructor
public class SugerenciaController {

    private final SugerenciaService sugerenciaService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR', 'TESORERO','OWNER')")
    public String enviarSugerencia(@Valid @RequestBody SugerenciaDto request) {
        sugerenciaService.enviarSugerencia(request);
        return "Sugerencia enviada correctamente.";
    }
}