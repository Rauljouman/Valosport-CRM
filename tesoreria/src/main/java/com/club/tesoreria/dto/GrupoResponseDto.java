package com.club.tesoreria.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GrupoResponseDto {

    private Long id;
    private String nombre;
    private Long clubId;
    private String clubNombre;

    private String categoria;
    private Integer numeroJugadores;
    private String entrenadorNombre;
    private Double totalPendiente;
    private Double totalPagado;
}