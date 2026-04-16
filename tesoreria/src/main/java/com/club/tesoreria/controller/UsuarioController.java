package com.club.tesoreria.controller;

import com.club.tesoreria.model.TipoRol;
import com.club.tesoreria.model.Usuario;
import com.club.tesoreria.repository.UsuarioRepository;
import com.club.tesoreria.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    // Recibe los datos del front y los manda al service para registrar al socio y su equipo.
    @PostMapping
    public Usuario crear(@RequestBody Usuario nuevoUsuario) {
        return usuarioService.registrarUsuario(nuevoUsuario);
    }

    // Devuelve la lista completa de socios de la base de datos.
    @GetMapping
    public List<Usuario> listarTodos(){
        return usuarioRepository.findAll();
    }

    // Busca al socio por ID y le pisa los datos con lo que mandamos desde el front.
    @PutMapping("/{id}")
    public Usuario actualizar(@PathVariable Long id, @RequestBody Usuario nuevosDatos) {
        return usuarioRepository.findById(id).map(usuarioExiste -> {
            usuarioExiste.setNombre(nuevosDatos.getNombre());
            usuarioExiste.setApellido(nuevosDatos.getApellido());
            usuarioExiste.setEmail(nuevosDatos.getEmail());
            usuarioExiste.setTelefono(nuevosDatos.getTelefono());
            usuarioExiste.setCuotaAnual(nuevosDatos.getCuotaAnual());
            usuarioExiste.setSaldoPendiente(nuevosDatos.getSaldoPendiente());
            usuarioExiste.setRutaDocumento(nuevosDatos.getRutaDocumento());
            usuarioExiste.setRol(nuevosDatos.getRol());
            return usuarioRepository.save(usuarioExiste);
        }).orElseThrow(() -> new RuntimeException("No existe el jugador con ID: " + id));
    }

    // Borra al socio, pero antes chequea que no sea un ADMIN para no liarla.
    @DeleteMapping("/{id}")
    public String Eliminar(@PathVariable Long id) {
        Usuario usuarioBorrar = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        if (usuarioBorrar.getRol() == TipoRol.ADMIN) {
            throw new RuntimeException("Protección: No se puede borrar a un administrador.");
        }

        usuarioRepository.deleteById(id);
        return "Usuario eliminado.";
    }

    // Filtra y devuelve solo los socios que pertenecen a un equipo específico.
    @GetMapping("/por-equipo/{grupoId}")
    public List<Usuario> listarPorEquipo(@PathVariable Long grupoId) {
        return usuarioRepository.findByGrupoId(grupoId);
    }
}