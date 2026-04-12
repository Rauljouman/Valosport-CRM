package com.club.tesoreria.repository;

import com.club.tesoreria.model.Transaccion;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {

    // Filtra por el nombre del usuario vinculado a la transacción
    List<Transaccion> findByUsuario_NombreContainingIgnoreCase(String nombre);

    // Filtra por el DNI exacto del usuario vinculado
    List<Transaccion> findByUsuario_Dni(String dni);

    // Filtra por una cantidad exacta de dinero
    List<Transaccion> findByCantidad(Double cantidad);

    // Filtra por el rango de tiempo (necesario para el filtro de fechas)
    List<Transaccion> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);

    // Mantenemos el de título por si quieres buscar "Cuota" o "Patrocinio"
    List<Transaccion> findByTituloContainingIgnoreCase(String titulo);

    @Query("SELECT SUM(t.cantidad) FROM Transaccion t WHERE t.tipo = 'INGRESO'")
    Double sumarIngreso();

    @Query("SELECT SUM (t.cantidad) FROM Transaccion t WHERE t.tipo = 'RETIRO'")
    Double sumarRetiross();

    @Modifying
    @Transactional
    void deleteByFechaBefore(LocalDateTime fecha);
}