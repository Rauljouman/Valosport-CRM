package com.club.tesoreria.controller;

import com.club.tesoreria.dto.GrupoCrearDto;
import com.club.tesoreria.dto.GrupoResponseDto;
import com.club.tesoreria.model.Grupo;
import com.club.tesoreria.repository.GrupoRepository;
import com.club.tesoreria.service.GrupoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<GrupoResponseDto> listar() {
        return grupoService.listarGruposDelUsuario();
    }

    @PostMapping
    public GrupoResponseDto crearGrupo(@Valid @RequestBody GrupoCrearDto request) {
        return grupoService.crearGrupo(request);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        grupoRepository.deleteById(id);
    }
}