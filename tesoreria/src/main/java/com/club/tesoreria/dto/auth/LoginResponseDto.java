package com.club.tesoreria.dto.auth;

import com.club.tesoreria.model.TipoRolSistema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDto {

    private String token;

    private String email;

    private String nombre;

    private TipoRolSistema rol;

    private Long clubId;

    private String clubNombre;
}