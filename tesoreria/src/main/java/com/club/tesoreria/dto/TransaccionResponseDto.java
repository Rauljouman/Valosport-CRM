package com.club.tesoreria.dto;

import com.club.tesoreria.model.TipoTransaccion;
import com.club.tesoreria.model.TipoTransaccionCategoria;
import com.club.tesoreria.model.TipoTransaccionOrigen;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransaccionResponseDto {

    private Long id;

    private String titulo;

    private String descripcion;

    private Double cantidad;

    private LocalDateTime fecha;

    private TipoTransaccion tipo;

    private TipoTransaccionOrigen origen;

    private TipoTransaccionCategoria categoria;

    private Double saldoJugadorDespues;

    private Double saldoGeneralDespues;

    private Long jugadorId;

    private String jugadorNombre;

    private Long clubId;

    private String clubNombre;
}