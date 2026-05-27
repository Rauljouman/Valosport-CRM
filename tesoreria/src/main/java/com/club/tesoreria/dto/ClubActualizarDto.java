package com.club.tesoreria.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClubActualizarDto {

    @NotBlank
    private String nombre;

    private String ciudad;
}