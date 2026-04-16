package com.club.tesoreria.service;

import com.club.tesoreria.model.Grupo;
import com.club.tesoreria.model.Usuario;
import com.club.tesoreria.repository.GrupoRepository;
import com.club.tesoreria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private GrupoRepository grupoRepository;

    // Al registrar, busca si el nombre del equipo enviado existe para vincularlo correctamente.
    public Usuario registrarUsuario(Usuario usuario) {
        if (usuario.getGrupo() != null) {
            String nombre = usuario.getGrupo().getNombre();
            List<Grupo> grupoDB = grupoRepository.findByNombre(nombre);
            if (!grupoDB.isEmpty()){
                usuario.setGrupo(grupoDB.get(0));
            }
        }
        return usuarioRepository.save(usuario);
    }

    // Cambia a un usuario de equipo o lo quita de uno (poniéndolo a null).
    public Usuario asignarUsuario(Long usuarioId, Long grupoId){
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(()-> new RuntimeException("Usuario no encontrado."));

        if( grupoId == null) {
            usuario.setGrupo(null);
        } else {
            Grupo grupo = grupoRepository.findById(grupoId)
                    .orElseThrow(()-> new RuntimeException("Equipo no encontrado."));
            usuario.setGrupo(grupo);
        }
        return usuarioRepository.save(usuario);
    }
}