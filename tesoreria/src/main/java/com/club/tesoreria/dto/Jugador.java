/*package com.club.tesoreria.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "jugadores")
@Data
public class Jugador {

    @NotBlank
    private Long id;

    @NotBlank
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

    @NotNull
    private Double cuotaAnual;

    @NotBlank
    @Column(nullable = false)
    private String rutaDocumento;

    @NotNull
    private TipoRol rol;

    @NotNull
    private TipoEstatus estatus;

    @NotNull
    private Long grupoId;
}
*/