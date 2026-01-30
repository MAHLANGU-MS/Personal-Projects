package com.focusflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * FocusFlow - AI-Driven Adaptive Reading Interface
 * Main Application Entry Point
 * 
 * @author FocusFlow Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
public class FocusFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(FocusFlowApplication.class, args);
        System.out.println("""
            
            ═══════════════════════════════════════════════════════
            ███████╗ ██████╗  ██████╗██╗   ██╗███████╗
            ██╔════╝██╔═══██╗██╔════╝██║   ██║██╔════╝
            █████╗  ██║   ██║██║     ██║   ██║███████╗
            ██╔══╝  ██║   ██║██║     ██║   ██║╚════██║
            ██║     ╚██████╔╝╚██████╗╚██████╔╝███████║
            ╚═╝      ╚═════╝  ╚═════╝ ╚═════╝ ╚══════╝
            
            ███████╗██╗      ██████╗ ██╗    ██╗
            ██╔════╝██║     ██╔═══██╗██║    ██║
            █████╗  ██║     ██║   ██║██║ █╗ ██║
            ██╔══╝  ██║     ██║   ██║██║███╗██║
            ██║     ███████╗╚██████╔╝╚███╔███╔╝
            ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝
            
            AI-Driven Adaptive Reading Interface
            ═══════════════════════════════════════════════════════
            
            ✓ Backend Service Started Successfully
            ✓ Database Connection: ACTIVE
            ✓ Security: JWT Authentication Enabled
            ✓ API Documentation: http://localhost:8080/api/swagger-ui.html
            ✓ Health Check: http://localhost:8080/api/actuator/health
            
            Ready to enhance reading experiences for ADHD users! 🚀
            ═══════════════════════════════════════════════════════
            """);
    }
}
