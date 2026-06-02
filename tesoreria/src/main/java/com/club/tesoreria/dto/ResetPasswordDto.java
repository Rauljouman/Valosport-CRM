package com.club.tesoreria.dto;
import jakarta.validation.constraints.*;

import lombok.Data;

@Data
public class ResetPasswordDto {
    @NotBlank
    private String token;

    @NotBlank
    private String nuevaPassword;
}