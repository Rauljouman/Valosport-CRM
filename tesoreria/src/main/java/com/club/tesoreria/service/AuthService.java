package com.club.tesoreria.service;

import com.club.tesoreria.dto.auth.LoginRequestDto;
import com.club.tesoreria.dto.auth.LoginResponseDto;
import com.club.tesoreria.model.UsuarioSistema;
import com.club.tesoreria.repository.UsuarioSistemaRepository;
import com.club.tesoreria.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioSistemaRepository usuarioSistemaRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponseDto login(LoginRequestDto request) {
        UsuarioSistema usuario = usuarioSistemaRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtService.generarToken(usuario);

        return new LoginResponseDto(
                token,
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getRol(),
                usuario.getClub().getId(),
                usuario.getClub().getNombre()
        );
    }
}