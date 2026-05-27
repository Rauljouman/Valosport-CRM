package com.club.tesoreria.service;

import com.club.tesoreria.dto.SugerenciaDto;
import com.club.tesoreria.model.UsuarioSistema;
import com.club.tesoreria.security.AuthenticatedUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SugerenciaService {

    private final JavaMailSender mailSender;
    private final AuthenticatedUserService authenticatedUserService;

    @Value("${app.sugerencias.destinatario}")
    private String destinatario;

    public void enviarSugerencia(SugerenciaDto request) {
        UsuarioSistema usuario = authenticatedUserService.getUsuarioActual();

        String cuerpo = """

        👤 %s  |  📧 %s
        🏟️ %s

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        📌 %s  |  📝 %s
        💬 Mensaje:
        %s

        Enviado automáticamente desde Valosport CRM
        """.formatted(usuario.getNombre(),
                usuario.getEmail(),
                usuario.getClub().getNombre(),
                request.getTipo(),
                request.getAsunto(),
                request.getMensaje()
        );

        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject("Valosport | Nueva sugerencia: " + request.getAsunto());
        mensaje.setText(cuerpo);

        mailSender.send(mensaje);
    }
}