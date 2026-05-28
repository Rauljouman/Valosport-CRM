package com.club.tesoreria.controller;

import com.club.tesoreria.dto.UsuarioActualizarDto;
import com.club.tesoreria.dto.UsuarioCrearDto;
import com.club.tesoreria.dto.UsuarioResponseDto;
import com.club.tesoreria.dto.UsuarioRolActualizarDto;
import com.club.tesoreria.service.UsuarioSistemaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioSistemaController {

    private final UsuarioSistemaService usuarioSistemaService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioResponseDto crearUsuario(@Valid @RequestBody UsuarioCrearDto request) {
        return usuarioSistemaService.crearUsuario(request);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioResponseDto> listarUsuarios() {
        return usuarioSistemaService.listarUsuariosClubActual();
    }

    @PutMapping("/{id}/rol")
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioResponseDto actualizarRol(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioRolActualizarDto request
    ) {
        return usuarioSistemaService.actualizarRol(id, request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioResponseDto actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioActualizarDto request
    ) {
        return usuarioSistemaService.actualizarUsuario(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminarUsuario(@PathVariable Long id) {
        usuarioSistemaService.eliminarUsuario(id);
    }
}