package com.club.tesoreria.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SugerenciaDto {

    @NotBlank
    private String tipo;

    @NotBlank
    private String asunto;

    @NotBlank
    private String mensaje;
}