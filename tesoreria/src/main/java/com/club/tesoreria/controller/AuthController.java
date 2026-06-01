package com.club.tesoreria.controller;

import com.club.tesoreria.dto.CambiarPasswordRequestDto;
import com.club.tesoreria.dto.ResetPasswordDto;
import com.club.tesoreria.dto.SolicitarResetPasswordDto;
import com.club.tesoreria.dto.auth.LoginRequestDto;
import com.club.tesoreria.dto.auth.LoginResponseDto;
import com.club.tesoreria.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponseDto login(@Valid @RequestBody LoginRequestDto request) {
        return authService.login(request);
    }

    @PostMapping("/cambiar-password")
    public ResponseEntity<String> cambiarPassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CambiarPasswordRequestDto request
    ) {
        authService.cambiarPassword(userDetails.getUsername(), request);
        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody SolicitarResetPasswordDto request
    ) {
        authService.solicitarRecuperacionPassword(request);
        return ResponseEntity.ok("Si el correo existe, recibirás instrucciones para restablecer tu contraseña.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordDto request
    ) {
        authService.resetearPassword(request);
        return ResponseEntity.ok("Contraseña restablecida correctamente");
    }
}