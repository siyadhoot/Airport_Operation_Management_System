package com.airport.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BeltCreateRequest {
    @NotBlank
    private String beltCode;
    @NotBlank
    private String terminal;
}
