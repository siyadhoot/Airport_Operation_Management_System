package com.airport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RunwayDTO {
    private Long id;
    private String runwayCode;
    private int lengthMeters;
    private String status;
    private Long currentFlightId;
    private String currentFlightNumber;
}
