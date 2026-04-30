package com.airport.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AircraftCreateRequest {
    @NotBlank
    private String registrationNumber;
    @NotBlank
    private String model;
    private String manufacturer;
    @Min(1)
    private int capacity;
}
