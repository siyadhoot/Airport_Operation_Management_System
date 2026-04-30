package com.airport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AircraftDTO {
    private Long id;
    private String registrationNumber;
    private String model;
    private String manufacturer;
    private int capacity;
    private String status;
}
