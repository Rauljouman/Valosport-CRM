package com.club.tesoreria.service;

import com.club.tesoreria.dto.ClubActualizarDto;
import com.club.tesoreria.dto.ClubResponseDto;
import com.club.tesoreria.model.Club;
import com.club.tesoreria.repository.ClubRepository;
import com.club.tesoreria.security.AuthenticatedUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public ClubResponseDto obtenerClubActual() {
        Long clubId = authenticatedUserService.getClubIdActual();

        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club no encontrado."));

        return convertirAResponseDto(club);
    }

    public ClubResponseDto actualizarClubActual(ClubActualizarDto request) {
        Long clubId = authenticatedUserService.getClubIdActual();

        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club no encontrado."));

        club.setNombre(request.getNombre());
        club.setCiudad(request.getCiudad());

        Club clubActualizado = clubRepository.save(club);

        return convertirAResponseDto(clubActualizado);
    }

    private ClubResponseDto convertirAResponseDto(Club club) {
        return new ClubResponseDto(
                club.getId(),
                club.getNombre(),
                club.getCiudad(),
                club.getActivo()
        );
    }
}