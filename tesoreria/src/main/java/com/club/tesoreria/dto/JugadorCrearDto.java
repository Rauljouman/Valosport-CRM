package com.club.tesoreria.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import com.club.tesoreria.model.TipoEstatus;
import com.club.tesoreria.model.TipoRol;

@Data
public class JugadorCrearDto {

    private String dni;

    @NotBlank
    private String nombre;

    @NotBlank
    private String apellido;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String telefono;

    @NotBlank
    private String direccion;

    @NotBlank
    private String fechaNacimiento;

    @NotNull(message = "La cuota anual es obligatoria.")
    @PositiveOrZero(message = "La cuota anual debe ser mayor a 0.")
    private Double cuotaAnual;

    private String rutaDocumento = "";

    @NotNull
    private TipoRol rol;

    @NotNull
    private TipoEstatus estatus;

    @NotNull
    private Long grupoId;
}