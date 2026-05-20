package com.club.tesoreria.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class GrupoCrearDto {

    @NotBlank(message = "El nombre del grupo es obligatorio.")
    private String nombre;
}
