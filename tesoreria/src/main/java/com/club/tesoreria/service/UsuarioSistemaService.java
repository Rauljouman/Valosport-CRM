package com.club.tesoreria.service;

import com.club.tesoreria.dto.UsuarioActualizarDto;
import com.club.tesoreria.dto.UsuarioCrearDto;
import com.club.tesoreria.dto.UsuarioResponseDto;
import com.club.tesoreria.dto.UsuarioRolActualizarDto;
import com.club.tesoreria.model.Club;
import com.club.tesoreria.model.TipoRolSistema;
import com.club.tesoreria.model.UsuarioSistema;
import com.club.tesoreria.repository.UsuarioSistemaRepository;
import com.club.tesoreria.security.AuthenticatedUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioSistemaService {

    private final UsuarioSistemaRepository usuarioSistemaRepository;
    private final AuthenticatedUserService authenticatedUserService;
    private final PasswordEncoder passwordEncoder;

    public UsuarioResponseDto crearUsuario(UsuarioCrearDto request) {
        if (usuarioSistemaRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con ese email.");
        }

        Club club = authenticatedUserService.getUsuarioActual().getClub();

        UsuarioSistema usuario = new UsuarioSistema();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(request.getRol());
        usuario.setClub(club);

        UsuarioSistema guardado = usuarioSistemaRepository.save(usuario);

        return convertirAResponseDto(guardado);
    }

    public List<UsuarioResponseDto> listarUsuariosClubActual() {
        Long clubId = authenticatedUserService.getClubIdActual();

        return usuarioSistemaRepository.findByClubId(clubId)
                .stream()
                .map(this::convertirAResponseDto)
                .toList();
    }

    public UsuarioResponseDto actualizarRol(Long id, UsuarioRolActualizarDto request) {
        Long clubId = authenticatedUserService.getClubIdActual();

        UsuarioSistema usuario = usuarioSistemaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        if (!usuario.getClub().getId().equals(clubId)) {
            throw new RuntimeException("El usuario no pertenece a tu club.");
        }

        usuario.setRol(request.getRol());

        UsuarioSistema actualizado = usuarioSistemaRepository.save(usuario);

        return convertirAResponseDto(actualizado);
    }

    private UsuarioResponseDto convertirAResponseDto(UsuarioSistema usuario) {
        return new UsuarioResponseDto(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getClub().getId(),
                usuario.getClub().getNombre()
        );
    }

    public void eliminarUsuario(Long id) {
        UsuarioSistema usuarioActual = authenticatedUserService.getUsuarioActual();
        Long clubId = usuarioActual.getClub().getId();

        UsuarioSistema usuarioAEliminar = usuarioSistemaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        if (!usuarioAEliminar.getClub().getId().equals(clubId)) {
            throw new RuntimeException("El usuario no pertenece a tu club.");
        }

        if (usuarioAEliminar.getId().equals(usuarioActual.getId())) {
            throw new RuntimeException("No puedes eliminar tu propio usuario.");
        }

        if (usuarioAEliminar.getRol() == TipoRolSistema.ADMIN) {
            throw new RuntimeException("No puedes eliminar a otro administrador.");
        }

        usuarioSistemaRepository.deleteById(id);
    }

    public UsuarioResponseDto actualizarUsuario(Long id, UsuarioActualizarDto request) {
        Long clubId = authenticatedUserService.getClubIdActual();

        UsuarioSistema usuario = usuarioSistemaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        if (!usuario.getClub().getId().equals(clubId)) {
            throw new RuntimeException("El usuario no pertenece a tu club.");
        }

        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());

        UsuarioSistema actualizado = usuarioSistemaRepository.save(usuario);

        return convertirAResponseDto(actualizado);
    }
}