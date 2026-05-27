package com.club.tesoreria.controller;

import com.club.tesoreria.model.Club;
import com.club.tesoreria.repository.ClubRepository;
import com.club.tesoreria.service.ClubService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.club.tesoreria.dto.ClubActualizarDto;
import com.club.tesoreria.dto.ClubResponseDto;
import com.club.tesoreria.service.ClubService;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/clubes")
@RequiredArgsConstructor
public class ClubController {

    @Autowired
    private ClubService clubService;

    private final ClubRepository clubRepository;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Club> crear(@RequestBody Club club) {
        club.setActivo(true);
        return ResponseEntity.ok(clubRepository.save(club));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Club>> listar() {
        return ResponseEntity.ok(clubRepository.findAll());
    }

    @GetMapping("/actual")
    @PreAuthorize("hasRole('ADMIN')")
    public ClubResponseDto obtenerClubActual() {
        return clubService.obtenerClubActual();
    }

    @PutMapping("/actual")
    @PreAuthorize("hasRole('ADMIN')")
    public ClubResponseDto actualizarClubActual(
            @Valid @RequestBody ClubActualizarDto request
    ) {
        return clubService.actualizarClubActual(request);
    }
}