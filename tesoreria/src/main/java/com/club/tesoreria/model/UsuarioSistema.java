package com.club.tesoreria.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "usuarios_sistema")
@Data
public class UsuarioSistema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash; 

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoRolSistema rol;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    private String resetPasswordToken;

    private LocalDateTime resetPasswordTokenExpiry;
}