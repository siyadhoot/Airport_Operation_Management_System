package com.airport.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RunwayCreateRequest {
    @NotBlank
    private String runwayCode;
    @Min(1000)
    private int lengthMeters;
}
