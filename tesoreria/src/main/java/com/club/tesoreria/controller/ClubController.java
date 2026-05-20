package com.club.tesoreria.controller;

import com.club.tesoreria.model.Club;
import com.club.tesoreria.repository.ClubRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubes")
@RequiredArgsConstructor
public class ClubController {

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
}