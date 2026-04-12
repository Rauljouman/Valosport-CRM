package com.club.tesoreria.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Data

public class Usuario {
    //Primary key
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String dni;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(nullable = false, length = 50)
    private String apellido;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String telefono;

    @Column(nullable = false, unique = false)
    private String direccion;

    @Column(nullable = false, unique = false)
    private String fechaNacimiento;

    private Double cuotaAnual;

    private Double saldoPendiente;

    private String rutaDocumento;

    @Enumerated(EnumType.STRING)
    private TipoRol rol;

    @Enumerated(EnumType.STRING)
    private TipoEstatus estatus;

    @ManyToOne
    @JoinColumn(name = "grupo_id")
    private Grupo grupo;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("usuario")
    private List<Transaccion> transacciones = new java.util.ArrayList<>();
}
