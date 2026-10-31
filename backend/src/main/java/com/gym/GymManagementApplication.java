package com.gym;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GymManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(GymManagementApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  IRONPULSE GYM MANAGEMENT BACKEND RUNNING");
        System.out.println("  Port: 8080");
        System.out.println("  API Base: http://localhost:8080/api");
        System.out.println("  Default Admin: admin / admin123");
        System.out.println("=================================================");
    }
}
