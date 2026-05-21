package com.club.tesoreria.service;

import com.club.tesoreria.dto.GrupoCrearDto;
import com.club.tesoreria.dto.GrupoResponseDto;
import com.club.tesoreria.model.Club;
import com.club.tesoreria.model.Grupo;
import com.club.tesoreria.model.Jugador;
import com.club.tesoreria.repository.GrupoRepository;
import com.club.tesoreria.repository.JugadorRepository;
import com.club.tesoreria.security.AuthenticatedUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GrupoService {

    private final GrupoRepository grupoRepository;
    private final JugadorRepository jugadorRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public GrupoResponseDto crearGrupo(GrupoCrearDto request) {

        Club club = authenticatedUserService.getUsuarioActual().getClub();

        Grupo grupo = new Grupo();
        grupo.setNombre(request.getNombre());
        grupo.setCategoria(request.getCategoria());
        grupo.setClub(club);

        Grupo grupoGuardado = grupoRepository.save(grupo);
        return convertirAResponseDto(grupoGuardado);
    }

    public List<GrupoResponseDto> listarGruposDelUsuario() {
        Long clubId = authenticatedUserService.getClubIdActual();

        return grupoRepository.findByClubId(clubId)
                .stream()
                .map(this::convertirAResponseDto)
                .toList();
    }

    private GrupoResponseDto convertirAResponseDto(Grupo grupo) {
        List<Jugador> jugadores = jugadorRepository.findByGrupoId(grupo.getId());

        int numeroJugadores = jugadores.size();

        double totalPendiente = jugadores.stream()
                .mapToDouble(jugador -> jugador.getSaldoPendiente() != null ? jugador.getSaldoPendiente() : 0.0)
                .sum();

        double totalPagado = jugadores.stream()
                .mapToDouble(jugador -> {
                    double cuota = jugador.getCuotaAnual() != null ? jugador.getCuotaAnual() : 0.0;
                    double pendiente = jugador.getSaldoPendiente() != null ? jugador.getSaldoPendiente() : 0.0;
                    return cuota - pendiente;
                })
                .sum();

        GrupoResponseDto dto = new GrupoResponseDto();

        dto.setId(grupo.getId());
        dto.setNombre(grupo.getNombre());
        dto.setCategoria(grupo.getCategoria());

        dto.setClubId(grupo.getClub().getId());
        dto.setClubNombre(grupo.getClub().getNombre());

        dto.setNumeroJugadores(numeroJugadores);
        dto.setEntrenadorNombre(null);
        dto.setTotalPendiente(totalPendiente);
        dto.setTotalPagado(totalPagado);

        return dto;
    }
}