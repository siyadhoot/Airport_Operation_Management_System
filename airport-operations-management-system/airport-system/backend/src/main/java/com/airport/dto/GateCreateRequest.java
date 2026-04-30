package com.airport.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GateCreateRequest {
    @NotBlank
    private String gateCode;
    @NotBlank
    private String terminal;
}
