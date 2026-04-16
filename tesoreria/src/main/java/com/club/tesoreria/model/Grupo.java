package com.club.tesoreria.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "grupos")
@Data

public class Grupo{
    //Primary key y Auto-increment
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String categoria;
}

