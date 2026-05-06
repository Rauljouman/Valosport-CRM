package com.club.tesoreria.service;

import com.club.tesoreria.model.Grupo;
import com.club.tesoreria.model.Jugador;
import com.club.tesoreria.repository.GrupoRepository;
import com.club.tesoreria.repository.JugadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JugadorService {

    @Autowired
    private JugadorRepository jugadorRepository;

    @Autowired
    private GrupoRepository grupoRepository;

    public Jugador registrarJugador(Jugador jugador) {
        if (jugador.getGrupo() != null) {
            String nombre = jugador.getGrupo().getNombre();
            List<Grupo> grupoDB = grupoRepository.findByNombre(nombre);
            if (!grupoDB.isEmpty()) {
                jugador.setGrupo(grupoDB.get(0));
            }
        }

        return jugadorRepository.save(jugador);
    }

    public Jugador asignarJugador(Long jugadorId, Long grupoId) {
        Jugador jugador = jugadorRepository.findById(jugadorId)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        if (grupoId == null) {
            jugador.setGrupo(null);
        } else {
            Grupo grupo = grupoRepository.findById(grupoId)
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
            jugador.setGrupo(grupo);
        }

        return jugadorRepository.save(jugador);
    }
}