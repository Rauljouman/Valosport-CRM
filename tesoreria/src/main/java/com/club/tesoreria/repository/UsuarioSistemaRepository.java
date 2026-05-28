package com.club.tesoreria.repository;

import com.club.tesoreria.model.TipoRolSistema;
import com.club.tesoreria.model.UsuarioSistema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UsuarioSistemaRepository extends JpaRepository<UsuarioSistema, Long> {
    Optional<UsuarioSistema> findByEmail(String email);
    
    List<UsuarioSistema> findByClubId(Long clubId);

    boolean existsByEmail(String email);
    
    long countByClubIdAndRol(Long clubId, TipoRolSistema rol);
}