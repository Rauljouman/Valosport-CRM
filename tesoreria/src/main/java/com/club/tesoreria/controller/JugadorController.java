package com.club.tesoreria.controller;

import com.club.tesoreria.dto.JugadorCrearDto;
import com.club.tesoreria.dto.JugadorFiltroDto;
import com.club.tesoreria.dto.JugadorResponseDto;
import com.club.tesoreria.model.Jugador;
import com.club.tesoreria.model.TipoEstatus;
import com.club.tesoreria.model.TipoRol;
import com.club.tesoreria.repository.JugadorRepository;
import com.club.tesoreria.service.JugadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/jugadores")
public class JugadorController {
    
    @Autowired
    private JugadorRepository jugadorRepository;

    @Autowired
    private JugadorService jugadorService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR')")
    public JugadorResponseDto crear(@Valid @RequestBody JugadorCrearDto request) {
        return jugadorService.registrarJugador(request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR', 'TESORERO')")
    public List<JugadorResponseDto> listarTodos(){
        return jugadorService.listarJugadores();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR')")
    public JugadorResponseDto actualizar(
            @PathVariable Long id,
            @RequestBody Jugador nuevosDatos
    ) {
        return jugadorService.actualizarJugador(id, nuevosDatos);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String eliminar(@PathVariable Long id) {
        jugadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no existe"));

        jugadorRepository.deleteById(id);
        return "Jugador eliminado con éxito";
    }
        

    @GetMapping("/por-equipo/{grupoId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR', 'TESORERO')")
    public List<Jugador> listarPorEquipo(@PathVariable Long grupoId) {
        return jugadorRepository.findByGrupoId(grupoId);
    }

    @GetMapping("/filtrar")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR', 'TESORERO')")
    public Page<Jugador> filtrarJugadores(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String apellido,
            @RequestParam(required = false) String dni,
            @RequestParam(required = false) Long grupoId,
            @RequestParam(required = false) TipoEstatus estatus,
            @RequestParam(required = false) TipoRol rol,
            @RequestParam(required = false) Boolean conDeuda,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
    JugadorFiltroDto filtro = new JugadorFiltroDto();

        filtro.setNombre(nombre);
        filtro.setApellido(apellido);
        filtro.setDni(dni);
        filtro.setGrupoId(grupoId);
        filtro.setEstatus(estatus);
        filtro.setRol(rol);
        filtro.setConDeuda(conDeuda);

        Pageable pageable = PageRequest.of(page, size);

        return jugadorService.filtrarJugadores(filtro, pageable);
    }
}