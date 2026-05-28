package com.club.tesoreria.dto;

import com.club.tesoreria.model.TipoRolSistema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsuarioRolActualizarDto {

    @NotNull
    private TipoRolSistema rol;
}