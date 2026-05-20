package com.club.tesoreria.dto;

import java.time.LocalDate;
import com.club.tesoreria.model.TipoTransaccion;
import com.club.tesoreria.model.TipoTransaccionCategoria;
import com.club.tesoreria.model.TipoTransaccionOrigen;

import lombok.Data;

@Data
public class TransaccionFiltroDto {

    private TipoTransaccion tipo;

    private TipoTransaccionOrigen origen;

    private TipoTransaccionCategoria categoria;

    private Long jugadorId;

    private LocalDate fechaDesde;

    private LocalDate fechaHasta;

    private Double cantidadMin;

    private Double cantidadMax;

    private String titulo;
}
