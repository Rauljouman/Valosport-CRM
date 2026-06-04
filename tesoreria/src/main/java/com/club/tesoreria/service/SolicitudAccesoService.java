package com.club.tesoreria.service;

import com.club.tesoreria.dto.SolicitudAccesoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SolicitudAccesoService {

    private final JavaMailSender mailSender;

    @Value("${app.sugerencias.destinatario}")
    private String destinatario;

    public void enviarSolicitud(SolicitudAccesoDto request) {
        SimpleMailMessage mensaje = new SimpleMailMessage();

        mensaje.setTo(destinatario);
        mensaje.setSubject("Nueva solicitud de acceso - Valosport CRM");

        mensaje.setText("""
                Nueva solicitud de acceso a Valosport CRM.

                Nombre: %s
                Email: %s
                Teléfono: %s
                Club: %s
                Rol solicitado: %s

                Mensaje:
                %s
                """.formatted(
                request.getNombre(),
                request.getEmail(),
                request.getTelefono(),
                request.getClub(),
                request.getRol(),
                request.getMensaje() == null || request.getMensaje().isBlank()
                        ? "Sin mensaje adicional."
                        : request.getMensaje()
        ));

        mailSender.send(mensaje);
    }
}