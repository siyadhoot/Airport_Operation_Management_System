package com.airport.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Login request payload
 */
@Data
@NoArgsConstructor
@AllArgsConstructor

public class LoginRequest {
    @NotBlank
    String username;
    @NotBlank
    String password;
}
