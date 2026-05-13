package com.club.tesoreria.repository;

import com.club.tesoreria.model.Jugador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JugadorRepository extends JpaRepository<Jugador, Long>, JpaSpecificationExecutor<Jugador> {
    
    List<Jugador> findByGrupoId(Long grupoId);

    List<Jugador> findByClubId(Long clubId);
}