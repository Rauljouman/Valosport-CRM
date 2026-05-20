package com.club.tesoreria.security;

import com.club.tesoreria.model.UsuarioSistema;
import com.club.tesoreria.repository.UsuarioSistemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticatedUserService {

    private final UsuarioSistemaRepository usuarioSistemaRepository;

    public UsuarioSistema getUsuarioActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("No hay usuario autenticado.");
        }

        String email = authentication.getName();

        return usuarioSistemaRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado en base de datos."));
    }

    public Long getClubIdActual() {
        return getUsuarioActual().getClub().getId();
    }
}