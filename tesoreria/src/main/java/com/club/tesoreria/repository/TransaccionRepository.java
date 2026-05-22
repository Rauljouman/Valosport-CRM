package com.club.tesoreria.repository;

import com.club.tesoreria.model.Transaccion;
import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TransaccionRepository extends JpaRepository<Transaccion, Long>, JpaSpecificationExecutor<Transaccion> {

    List<Transaccion> findByJugador_NombreContainingIgnoreCase(String nombre);

    List<Transaccion> findByJugador_Dni(String dni);

    List<Transaccion> findByCantidad(Double cantidad);

    List<Transaccion> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Transaccion> findByTituloContainingIgnoreCase(String titulo);

    @Query("SELECT SUM(t.cantidad) FROM Transaccion t WHERE t.tipo = 'INGRESO'")
    Double sumarIngreso();

    @Query("SELECT SUM(t.cantidad) FROM Transaccion t WHERE t.tipo = 'RETIRO'")
    Double sumarRetiros();

    @Query("SELECT SUM(t.cantidad) FROM Transaccion t WHERE t.tipo = 'INGRESO'")
    Double sumarIngresoClub(@Param("clubId") Long clubId);

    @Query("SELECT SUM(t.cantidad) FROM Transaccion t WHERE t.tipo = 'RETIRO'")
    Double sumarRetirosClub(@Param("clubId") Long clubId);

    @Query("""
        SELECT COALESCE(SUM(t.cantidad), 0)
        FROM Transaccion t
        WHERE t.jugador.id = :jugadorId
        AND t.tipo = 'INGRESO'
    """)
    Double sumarIngresosPorJugador(@Param("jugadorId") Long jugadorId);

    @Modifying
    @Transactional
    void deleteByFechaBefore(LocalDateTime fecha);
}