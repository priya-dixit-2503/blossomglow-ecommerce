package com.blossomglow.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI blossomGlowOpenAPI() {
        final String securitySchemeName = "BearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("BlossomGlow Candle Creations - REST API")
                        .description("Production REST API documentation for BlossomGlow Handcrafted Candles & Artisanal Decor. Includes Catalog, Cart, Orders, Customer Auth, and Admin APIs.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Priya Dixit (Artisan Maker)")
                                .email("priya.dixit.25032002@gmail.com")
                                .url("https://blossomglow.com"))
                        .license(new License()
                                .name("Proprietary - BlossomGlow Atelier")
                                .url("https://blossomglow.com/terms")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter your JWT token obtained from /api/auth/login or /api/auth/register")));
    }
}
