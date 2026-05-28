package com.club.tesoreria.dto;

import com.club.tesoreria.model.TipoRolSistema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioResponseDto {

    private Long id;
    private String nombre;
    private String email;
    private TipoRolSistema rol;
    private Long clubId;
    private String clubNombre;
}