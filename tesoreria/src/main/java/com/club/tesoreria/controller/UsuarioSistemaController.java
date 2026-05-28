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
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public UsuarioResponseDto crearUsuario(@Valid @RequestBody UsuarioCrearDto request) {
        return usuarioSistemaService.crearUsuario(request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public List<UsuarioResponseDto> listarUsuarios() {
        return usuarioSistemaService.listarUsuariosClubActual();
    }

    @PutMapping("/{id}/rol")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public UsuarioResponseDto actualizarRol(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioRolActualizarDto request
    ) {
        return usuarioSistemaService.actualizarRol(id, request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public UsuarioResponseDto actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioActualizarDto request
    ) {
        return usuarioSistemaService.actualizarUsuario(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER')")
    public void eliminarUsuario(@PathVariable Long id) {
        usuarioSistemaService.eliminarUsuario(id);
    }
}