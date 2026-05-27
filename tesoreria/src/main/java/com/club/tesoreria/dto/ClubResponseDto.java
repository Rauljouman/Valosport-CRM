package com.club.tesoreria.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ClubResponseDto {

    private Long id;
    private String nombre;
    private String ciudad;
    private Boolean activo;
}