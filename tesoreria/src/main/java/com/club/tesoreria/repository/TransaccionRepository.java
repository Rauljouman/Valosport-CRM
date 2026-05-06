package com.club.tesoreria.repository;

import com.club.tesoreria.model.Transaccion;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {

    List<Transaccion> findByJugador_NombreContainingIgnoreCase(String nombre);

    List<Transaccion> findByJugador_Dni(String dni);

    List<Transaccion> findByCantidad(Double cantidad);

    List<Transaccion> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Transaccion> findByTituloContainingIgnoreCase(String titulo);

    @Query("SELECT SUM(t.cantidad) FROM Transaccion t WHERE t.tipo = 'INGRESO'")
    Double sumarIngreso();

    @Query("SELECT SUM(t.cantidad) FROM Transaccion t WHERE t.tipo = 'RETIRO'")
    Double sumarRetiros();

    @Modifying
    @Transactional
    void deleteByFechaBefore(LocalDateTime fecha);
}