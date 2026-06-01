package com.club.tesoreria.dto;
import jakarta.validation.constraints.*;

import lombok.Data;

@Data
public class SolicitarResetPasswordDto {
    @NotBlank
    @Email
    private String email;
}