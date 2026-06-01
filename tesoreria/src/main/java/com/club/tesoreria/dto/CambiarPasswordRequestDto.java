package com.club.tesoreria.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CambiarPasswordRequestDto {
    @NotBlank
    private String passwordActual;

    @NotBlank
    private String nuevaPassword;
}
