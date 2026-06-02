package com.club.tesoreria.controller;

import com.club.tesoreria.dto.GrupoCrearDto;
import com.club.tesoreria.dto.GrupoResponseDto;
import com.club.tesoreria.repository.GrupoRepository;
import com.club.tesoreria.service.GrupoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grupos")
public class GrupoController {

    @Autowired
    private GrupoRepository grupoRepository;

    @Autowired
    private GrupoService grupoService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR', 'TESORERO','OWNER')")
    public List<GrupoResponseDto> listar() {
        return grupoService.listarGruposDelUsuario();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR','OWNER')")
    public GrupoResponseDto actualizarGrupo(
            @PathVariable Long id,
            @Valid @RequestBody GrupoCrearDto request
    ) {
        return grupoService.actualizarGrupo(id, request);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR','OWNER')")
    public GrupoResponseDto crearGrupo(@Valid @RequestBody GrupoCrearDto request) {
        return grupoService.crearGrupo(request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public void eliminar(@PathVariable Long id) {
        grupoRepository.deleteById(id);
    }
}