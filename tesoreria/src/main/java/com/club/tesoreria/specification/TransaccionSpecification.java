package com.club.tesoreria.specification;

import com.club.tesoreria.dto.TransaccionFiltroDto;
import com.club.tesoreria.model.Transaccion;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class TransaccionSpecification {

    public static Specification<Transaccion> filtrar(TransaccionFiltroDto filtro, Long clubId) {
        return (root, query, criteriaBuilder) -> {
            var predicate = criteriaBuilder.conjunction();

            predicate = criteriaBuilder.and(
                predicate,
                criteriaBuilder.equal(root.get("club").get("id"), clubId)
            );

            if (filtro.getTipo() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("tipo"), filtro.getTipo())
                );
            }

            if (filtro.getOrigen() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("origen"), filtro.getOrigen())
                );
            }

            if (filtro.getCategoria() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("categoria"), filtro.getCategoria())
                );
            }

            if (filtro.getJugadorId() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("jugador").get("id"), filtro.getJugadorId())
                );
            }

            if (filtro.getFechaDesde() != null) {
                LocalDateTime desde = filtro.getFechaDesde().atStartOfDay();

                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.greaterThanOrEqualTo(root.get("fecha"), desde)
                );
            }

            if (filtro.getFechaHasta() != null) {
                LocalDateTime hasta = filtro.getFechaHasta().atTime(23, 59, 59);

                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.lessThanOrEqualTo(root.get("fecha"), hasta)
                );
            }

            if (filtro.getCantidadMin() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.greaterThanOrEqualTo(root.get("cantidad"), filtro.getCantidadMin())
                );
            }

            if (filtro.getCantidadMax() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.lessThanOrEqualTo(root.get("cantidad"), filtro.getCantidadMax())
                );
            }

            if (filtro.getTitulo() != null && !filtro.getTitulo().isBlank()) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("titulo")),
                                "%" + filtro.getTitulo().toLowerCase() + "%"
                        )
                );
            }

            return predicate;
        };
    }
}