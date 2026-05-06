package com.club.tesoreria.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "jugadores")
@Data
public class Jugador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String dni;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String nombre;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String apellido;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String telefono;

    @NotBlank
    @Column(nullable = false)
    private String direccion;

    @NotBlank
    @Column(nullable = false)
    private String fechaNacimiento;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Double cuotaAnual;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Double saldoPendiente;

    @NotBlank
    @Column(nullable = false)
    private String rutaDocumento;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoRol rol;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEstatus estatus;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "grupo_id", nullable = false)
    private Grupo grupo;

    @OneToMany(mappedBy = "jugador", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("jugador")
    private List<Transaccion> transacciones = new java.util.ArrayList<>();
}