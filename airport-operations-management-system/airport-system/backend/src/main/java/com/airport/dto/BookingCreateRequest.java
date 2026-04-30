package com.airport.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreateRequest {
    @NotNull
    private Long passengerId;
    @NotNull
    private Long flightId;
    private String seatNumber;
}
