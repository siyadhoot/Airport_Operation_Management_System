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
public class BookingDTO {
    private Long id;
    private String bookingReference;
    private Long passengerId;
    private String passengerName;
    private Long flightId;
    private String flightNumber;
    private String seatNumber;
    private String status;
    private LocalDateTime bookingTime;
}
