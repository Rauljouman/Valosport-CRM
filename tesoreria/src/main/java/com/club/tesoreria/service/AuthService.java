package com.club.tesoreria.service;

import com.club.tesoreria.dto.CambiarPasswordRequestDto;
import com.club.tesoreria.dto.ResetPasswordDto;
import com.club.tesoreria.dto.SolicitarResetPasswordDto;
import com.club.tesoreria.dto.auth.LoginRequestDto;
import com.club.tesoreria.dto.auth.LoginResponseDto;
import com.club.tesoreria.model.UsuarioSistema;
import com.club.tesoreria.repository.UsuarioSistemaRepository;
import com.club.tesoreria.security.JwtService;
import lombok.RequiredArgsConstructor;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioSistemaRepository usuarioSistemaRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

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

    public void cambiarPassword(String email, CambiarPasswordRequestDto request) {
        UsuarioSistema usuario = usuarioSistemaRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPasswordActual(), usuario.getPasswordHash())) {
            throw new RuntimeException("La contraseña actual no es correcta");
        }

        usuario.setPasswordHash(passwordEncoder.encode(request.getNuevaPassword()));
        usuarioSistemaRepository.save(usuario);
    }

    public void solicitarRecuperacionPassword(SolicitarResetPasswordDto request) {
        Optional<UsuarioSistema> usuarioOpt = usuarioSistemaRepository.findByEmail(request.getEmail());

        if (usuarioOpt.isEmpty()) {
            return; // No revelamos si el email existe
        }

        UsuarioSistema usuario = usuarioOpt.get();

        String token = UUID.randomUUID().toString();

        usuario.setResetPasswordToken(token);
        usuario.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(30));

        usuarioSistemaRepository.save(usuario);

        String resetLink = frontendUrl + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(usuario.getEmail());
        message.setSubject("Recuperar contraseña - Valosport CRM");
        message.setText(
                "Hola " + usuario.getNombre() + ",\n\n" +
                "Haz clic en este enlace para cambiar tu contraseña:\n" +
                resetLink + "\n\n" +
                "Este enlace caduca en 30 minutos.\n\n" +
                "Si no has solicitado este cambio, ignora este mensaje."
        );

        mailSender.send(message);
    }

    public void resetearPassword(ResetPasswordDto request) {
        UsuarioSistema usuario = usuarioSistemaRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Token inválido"));

        if (usuario.getResetPasswordTokenExpiry() == null ||
                usuario.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
                    
            usuario.setResetPasswordToken(null);
            usuario.setResetPasswordTokenExpiry(null);
            usuarioSistemaRepository.save(usuario);

            throw new RuntimeException("El enlace ha caducado");
        }

        usuario.setPasswordHash(passwordEncoder.encode(request.getNuevaPassword()));
        usuario.setResetPasswordToken(null);
        usuario.setResetPasswordTokenExpiry(null);

        usuarioSistemaRepository.save(usuario);
    }
}