package com.airport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightDTO {
    private Long id;
    private String dtype;           // DomesticFlight | InternationalFlight | CargoFlight | EmergencyFlight
    private String flightNumber;
    private String origin;
    private String destination;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private String status;
    private Long aircraftId;
    private String aircraftRegistration;
    private int priority;
    // Subclass fields
    private String zone;
    private String countryCode;
    private Boolean customsRequired;
    private Double cargoWeightKg;
    private String cargoType;
    private String emergencyReason;
    private Integer priorityLevel;
}
