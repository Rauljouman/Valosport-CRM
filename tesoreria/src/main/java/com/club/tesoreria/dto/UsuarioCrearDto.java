package com.club.tesoreria.dto;

import com.club.tesoreria.model.TipoRolSistema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsuarioCrearDto {

    @NotBlank
    private String nombre;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private TipoRolSistema rol;
}