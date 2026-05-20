package com.club.tesoreria.controller;

import com.club.tesoreria.dto.auth.LoginRequestDto;
import com.club.tesoreria.dto.auth.LoginResponseDto;
import com.club.tesoreria.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponseDto login(@Valid @RequestBody LoginRequestDto request) {
        return authService.login(request);
    }
}