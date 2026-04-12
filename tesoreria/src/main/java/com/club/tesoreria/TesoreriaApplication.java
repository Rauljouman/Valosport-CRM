package com.club.tesoreria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TesoreriaApplication {

	public static void main(String[] args) {
		SpringApplication.run(TesoreriaApplication.class, args);
	}

}
