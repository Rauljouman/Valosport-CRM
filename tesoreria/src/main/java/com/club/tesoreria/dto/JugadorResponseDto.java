package com.club.tesoreria.dto;

import com.club.tesoreria.model.TipoEstatus;
import com.club.tesoreria.model.TipoRol;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JugadorResponseDto {

    private Long id;

    private String dni;

    private String nombre;

    private String apellido;

    private String email;

    private String telefono;

    private Double cuotaAnual;

    private Double saldoPendiente;

    private TipoRol rol;

    private TipoEstatus estatus;

    private Long grupoId;

    private String grupoNombre;

    private Long clubId;

    private String clubNombre;
}