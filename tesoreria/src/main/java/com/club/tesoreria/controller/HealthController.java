package com.club.tesoreria.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String home() {
        return "Valosport CRM API funcionando";
    }

    @GetMapping("/api/health")
    public String health() {
        return "OK";
    }
}