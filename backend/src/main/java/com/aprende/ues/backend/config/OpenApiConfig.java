package com.aprende.ues.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Aprende UES - Educational Platform API")
                        .description("REST API for the Aprende UES learning platform. " +
                                "Built by students for students at Universidad de El Salvador.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("DAW Group 9")
                                .email("grupo9@ues.edu.sv")));
    }
}
