package com.club.tesoreria.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UsuarioActualizarDto {

    @NotBlank
    private String nombre;

    @NotBlank
    @Email
    private String email;
}