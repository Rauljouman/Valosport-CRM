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

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioSistemaService {

    private final UsuarioSistemaRepository usuarioSistemaRepository;
    private final AuthenticatedUserService authenticatedUserService;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

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

        enviarCorreoNuevoUsuario(guardado, request.getPassword());

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

        if (usuario.getRol() == TipoRolSistema.OWNER) {
            throw new RuntimeException("No puedes cambiar el rol del propietario del club.");
        }

        if (request.getRol() == TipoRolSistema.OWNER) {
            throw new RuntimeException("No puedes asignar el rol OWNER desde este panel.");
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

        if (usuarioAEliminar.getRol() == TipoRolSistema.OWNER) {
            throw new RuntimeException("No puedes eliminar al propietario del club.");
        }

        if (
                usuarioActual.getRol() == TipoRolSistema.ADMIN &&
                usuarioAEliminar.getRol() == TipoRolSistema.ADMIN
            ) {
                throw new RuntimeException("Un administrador no puede eliminar a otro administrador.");
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
    
    private void enviarCorreoNuevoUsuario(UsuarioSistema usuario, String passwordTemporal) {
        SimpleMailMessage mensaje = new SimpleMailMessage();

        mensaje.setTo(usuario.getEmail());
        mensaje.setSubject("Bienvenido a Valosport");

        mensaje.setText("""
                Hola %s,

                Se ha creado una cuenta para ti en Valosport.

                Datos de acceso:
                Email: %s
                Contraseña temporal: %s
                Rol asignado: %s
                Club: %s

                Te recomendamos cambiar la contraseña cuando accedas.

                Valosport CRM
                """.formatted(
                usuario.getNombre(),
                usuario.getEmail(),
                passwordTemporal,
                usuario.getRol(),
                usuario.getClub().getNombre()
        ));

        mailSender.send(mensaje);
    }
}