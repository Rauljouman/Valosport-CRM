package com.club.tesoreria.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SolicitudAccesoDto {

    @NotBlank
    private String nombre;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String telefono;

    @NotBlank
    private String club;

    @NotBlank
    private String rol;

    private String mensaje;
}