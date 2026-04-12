/*package com.club.tesoreria.service;

import com.club.tesoreria.repository.TransaccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TareaProgramadaService {

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Scheduled(cron = "0 0 5 * *")
    LocalDateTime limite = LocalDateTime.now()minusyear(5);
}*/
