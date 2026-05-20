package com.club.tesoreria.dto;

import com.club.tesoreria.model.TipoEstatus;
import com.club.tesoreria.model.TipoRol;
import lombok.Data;

@Data
public class JugadorFiltroDto {

    private String nombre;

    private String apellido;

    private String dni;

    private Long grupoId;

    private TipoEstatus estatus;

    private TipoRol rol;
    
    private Boolean conDeuda;
}