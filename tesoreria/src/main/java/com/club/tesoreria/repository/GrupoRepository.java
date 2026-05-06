package com.club.tesoreria.repository;

import com.club.tesoreria.model.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface GrupoRepository extends JpaRepository<Grupo, Long> {

    List<Grupo> findByNombre(String nombre);
}

