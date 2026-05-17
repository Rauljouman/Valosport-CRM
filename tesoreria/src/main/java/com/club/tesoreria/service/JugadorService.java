package com.club.tesoreria.service;

import com.club.tesoreria.dto.JugadorCrearDto;
import com.club.tesoreria.dto.JugadorFiltroDto;
import com.club.tesoreria.dto.JugadorResponseDto;
import com.club.tesoreria.model.Club;
import com.club.tesoreria.model.Grupo;
import com.club.tesoreria.model.Jugador;
import com.club.tesoreria.repository.GrupoRepository;
import com.club.tesoreria.repository.JugadorRepository;
import com.club.tesoreria.security.AuthenticatedUserService;
import com.club.tesoreria.specification.JugadorSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JugadorService {

    @Autowired
    private AuthenticatedUserService authenticatedUserService;

    @Autowired
    private JugadorRepository jugadorRepository;

    @Autowired
    private GrupoRepository grupoRepository;


    public JugadorResponseDto registrarJugador(JugadorCrearDto request) {

        Club club = authenticatedUserService.getUsuarioActual().getClub();

        Grupo grupo = grupoRepository.findById(request.getGrupoId())
        .orElseThrow(() -> new RuntimeException("Grupo no encontrado"));

        if (!grupo.getClub().getId().equals(club.getId())) {
            throw new RuntimeException("El grupo no pertenece al club indicado.");
        }

        Jugador jugador = new Jugador();

        jugador.setDni(request.getDni());
        jugador.setNombre(request.getNombre());
        jugador.setApellido(request.getApellido());
        jugador.setEmail(request.getEmail());
        jugador.setTelefono(request.getTelefono());
        jugador.setDireccion(request.getDireccion());
        jugador.setFechaNacimiento(request.getFechaNacimiento());
        jugador.setCuotaAnual(request.getCuotaAnual());
        jugador.setSaldoPendiente(request.getCuotaAnual());
        jugador.setRutaDocumento(request.getRutaDocumento());
        jugador.setRol(request.getRol());
        jugador.setEstatus(request.getEstatus());
        jugador.setGrupo(grupo);
        jugador.setClub(club);
        
        Jugador jugadorGuardado = jugadorRepository.save(jugador);
        return convertirAResponseDto(jugadorGuardado);
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

    public Page<Jugador> filtrarJugadores(JugadorFiltroDto filtro, Pageable pageable) {
        return jugadorRepository.findAll(
                JugadorSpecification.filtrar(filtro),
                pageable
        );
    }

    private JugadorResponseDto convertirAResponseDto(Jugador jugador) {
        return new JugadorResponseDto(
                jugador.getId(),
                jugador.getDni(),
                jugador.getNombre(),
                jugador.getApellido(),
                jugador.getEmail(),
                jugador.getTelefono(),
                jugador.getCuotaAnual(),
                jugador.getSaldoPendiente(),
                jugador.getRol(),
                jugador.getEstatus(),
                jugador.getGrupo() != null ? jugador.getGrupo().getId() : null,
                jugador.getGrupo() != null ? jugador.getGrupo().getNombre() : null,
                jugador.getClub() != null ? jugador.getClub().getId() : null,
                jugador.getClub() != null ? jugador.getClub().getNombre() : null
        );
    }


    public List<JugadorResponseDto> listarJugadores() {
        Long clubId = authenticatedUserService.getClubIdActual();

    return jugadorRepository.findByClubId(clubId)
            .stream()
            .map(this::convertirAResponseDto)
            .toList();
    }

    public List<JugadorResponseDto> listarJugadoresPorClub(Long clubId) {
        return jugadorRepository.findByClubId(clubId)
                .stream()
                .map(this::convertirAResponseDto)
                .toList();
    }
}