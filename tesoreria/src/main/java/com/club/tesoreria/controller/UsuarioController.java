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
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    //Crear jugador
    @PostMapping
    public Usuario crear(@RequestBody Usuario nuevoUsuario) {
        return usuarioService.registrarUsuario(nuevoUsuario);
    }

    //Listar jugadores
    @GetMapping
    public List<Usuario> listarTodos(){
        return usuarioRepository.findAll();
    }

    //Actualizar jugador
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
            usuarioExiste.setRol(nuevosDatos.getRol());;

            return usuarioRepository.save(usuarioExiste);
        }).orElseThrow(() -> new RuntimeException("No he encontrado al jugador con ID: " + id));
    }

    //Borrar jugador
    @DeleteMapping("/{id}")
    public String Eliminar(@PathVariable Long id) {
        Usuario usuarioBorrar = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no existe"));

        // Imprime en la consola para espiar qué rol tiene el usuario realmente
        System.out.println("Intentando borrar usuario con ROL: " + usuarioBorrar.getRol());

        if (usuarioBorrar.getRol() == TipoRol.ADMIN) {
            throw new RuntimeException("No se puede borrar a un administrador por seguridad.");
        }

        usuarioRepository.deleteById(id);
        return "Usuario eliminado con éxito";
    }
    @GetMapping("/por-equipo/{grupoId}")
    public List<Usuario> listarPorEquipo(@PathVariable Long grupoId) {
        return usuarioRepository.findByGrupoId(grupoId);
    }

}
