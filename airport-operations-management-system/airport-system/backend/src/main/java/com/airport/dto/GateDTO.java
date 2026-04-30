package com.airport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GateDTO {
    private Long id;
    private String gateCode;
    private String terminal;
    private String status;
    private Long currentFlightId;
    private String currentFlightNumber;
}
