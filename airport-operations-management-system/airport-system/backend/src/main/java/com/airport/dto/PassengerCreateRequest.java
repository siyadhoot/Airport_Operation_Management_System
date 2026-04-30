package com.airport.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PassengerCreateRequest {
    @NotBlank
    private String name;
    @Email
    private String email;
    private String phone;
    private String passportNumber;
    private String nationality;
}
