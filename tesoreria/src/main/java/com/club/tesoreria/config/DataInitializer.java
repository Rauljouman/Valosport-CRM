package com.club.tesoreria.config;

import com.club.tesoreria.model.Club;
import com.club.tesoreria.model.TipoRolSistema;
import com.club.tesoreria.model.UsuarioSistema;
import com.club.tesoreria.repository.ClubRepository;
import com.club.tesoreria.repository.UsuarioSistemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioSistemaRepository usuarioSistemaRepository;
    private final ClubRepository clubRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Club club = obtenerOCrearClubDemo();

        crearUsuarioSiNoExiste(
                "Administrador",
                "admin@club.com",
                "123456",
                TipoRolSistema.ADMIN,
                club
        );

        crearUsuarioSiNoExiste(
                "Tesorero",
                "tesorero@club.com",
                "123456",
                TipoRolSistema.TESORERO,
                club
        );

        crearUsuarioSiNoExiste(
                "Coordinador",
                "coordinador@club.com",
                "123456",
                TipoRolSistema.COORDINADOR,
                club
        );
    }

    private Club obtenerOCrearClubDemo() {
        return clubRepository.findAll()
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    Club club = new Club();
                    club.setNombre("Atlètic Les Corts");
                    club.setCiudad("Barcelona");
                    club.setActivo(true);
                    return clubRepository.save(club);
                });
    }

    private void crearUsuarioSiNoExiste(
            String nombre,
            String email,
            String password,
            TipoRolSistema rol,
            Club club
    ) {
        if (usuarioSistemaRepository.findByEmail(email).isPresent()) {
            return;
        }

        UsuarioSistema usuario = new UsuarioSistema();
        usuario.setNombre(nombre);
        usuario.setEmail(email);
        usuario.setPasswordHash(passwordEncoder.encode(password));
        usuario.setRol(rol);
        usuario.setClub(club);

        usuarioSistemaRepository.save(usuario);
    }
}