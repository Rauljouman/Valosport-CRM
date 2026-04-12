package com.club.tesoreria.controller;

import com.club.tesoreria.model.Grupo;
import com.club.tesoreria.model.Transaccion;
import com.club.tesoreria.repository.GrupoRepository;
import com.club.tesoreria.repository.TransaccionRepository;
import com.club.tesoreria.service.TesoreriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/grupos")
public class GrupoController {

    @Autowired
    private GrupoRepository grupoRepository;

    @GetMapping
    public List<Grupo> listar(@RequestParam(required = false) String nombre) {
        if (nombre != null) {
            return grupoRepository.findByNombre(nombre);
        }
        return grupoRepository.findAll();
    }

    @PostMapping
    public Grupo crearGrupo(@RequestBody Grupo grupo){
        return grupoRepository.save(grupo);
    }

    @DeleteMapping("/{id}")
    public void eliminar( @PathVariable Long id){
        grupoRepository.deleteById(id);
    }

}