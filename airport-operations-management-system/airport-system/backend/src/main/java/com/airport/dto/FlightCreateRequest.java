package com.airport.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightCreateRequest {
    @NotBlank
    private String dtype;
    @NotBlank
    private String flightNumber;
    @NotBlank
    private String origin;
    @NotBlank
    private String destination;
    @NotNull
    private LocalDateTime departureTime;
    @NotNull
    private LocalDateTime arrivalTime;
    private Long aircraftId;
    // Subclass-specific
    private String zone;
    private String countryCode;
    private Boolean customsRequired;
    private Double cargoWeightKg;
    private String cargoType;
    private String emergencyReason;
    private Integer priorityLevel;
}
