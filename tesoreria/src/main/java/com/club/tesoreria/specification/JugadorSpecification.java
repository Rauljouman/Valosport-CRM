package com.club.tesoreria.specification;

import com.club.tesoreria.dto.JugadorFiltroDto;
import com.club.tesoreria.model.Jugador;
import org.springframework.data.jpa.domain.Specification;

public class JugadorSpecification {

    public static Specification<Jugador> filtrar(JugadorFiltroDto filtro) {
        return (root, query, criteriaBuilder) -> {

            var predicate = criteriaBuilder.conjunction();

            if (filtro.getNombre() != null && !filtro.getNombre().isBlank()) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("nombre")),
                                "%" + filtro.getNombre().toLowerCase() + "%"
                        )
                );
            }

            if (filtro.getApellido() != null && !filtro.getApellido().isBlank()) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("apellido")),
                                "%" + filtro.getApellido().toLowerCase() + "%"
                        )
                );
            }

            if (filtro.getDni() != null && !filtro.getDni().isBlank()) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("dni"), filtro.getDni())
                );
            }

            if (filtro.getGrupoId() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("grupo").get("id"), filtro.getGrupoId())
                );
            }

            if (filtro.getEstatus() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("estatus"), filtro.getEstatus())
                );
            }

            if (filtro.getRol() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("rol"), filtro.getRol())
                );
            }

            if (filtro.getConDeuda() != null) {
                if (filtro.getConDeuda()) {
                    predicate = criteriaBuilder.and(
                            predicate,
                            criteriaBuilder.greaterThan(root.get("saldoPendiente"), 0.0)
                    );
                } else {
                    predicate = criteriaBuilder.and(
                            predicate,
                            criteriaBuilder.equal(root.get("saldoPendiente"), 0.0)
                    );
                }
            }

            return predicate;
        };
    }
}