package com.club.tesoreria.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clubes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String ciudad;

    @Column(nullable = false)
    private Boolean activo = true;
}