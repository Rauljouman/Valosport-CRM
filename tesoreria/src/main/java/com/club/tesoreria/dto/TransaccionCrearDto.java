package com.club.tesoreria.dto;

import com.club.tesoreria.model.TipoTransaccion;
import com.club.tesoreria.model.TipoTransaccionCategoria;
import com.club.tesoreria.model.TipoTransaccionOrigen;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class TransaccionCrearDto {

    @NotBlank
    private String titulo;

    @NotBlank
    private String descripcion;

    @NotNull
    @Positive(message = "Tiene que ser un número positivo")
    private Double cantidad;

    @NotNull
    private TipoTransaccion tipo;

    private Long jugadorId;

    @NotNull
    private TipoTransaccionOrigen origen;

    @NotNull
    private TipoTransaccionCategoria categoria;
}