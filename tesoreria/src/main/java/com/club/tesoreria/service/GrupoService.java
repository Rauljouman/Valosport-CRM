package com.club.tesoreria.service;

import com.club.tesoreria.dto.GrupoCrearDto;
import com.club.tesoreria.dto.GrupoResponseDto;
import com.club.tesoreria.model.Club;
import com.club.tesoreria.model.Grupo;
import com.club.tesoreria.repository.GrupoRepository;
import com.club.tesoreria.security.AuthenticatedUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GrupoService {

    private final GrupoRepository grupoRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public GrupoResponseDto crearGrupo(GrupoCrearDto request) {

        Club club = authenticatedUserService.getUsuarioActual().getClub();

        Grupo grupo = new Grupo();
        grupo.setNombre(request.getNombre());
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
        return new GrupoResponseDto(
                grupo.getId(),
                grupo.getNombre(),
                grupo.getClub().getId(),
                grupo.getClub().getNombre()
        );
    }
}