package com.airport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDTO {
    private long totalFlights;
    private long scheduledFlights;
    private long delayedFlights;
    private long activeFlights;
    private long totalPassengers;
    private long totalBookings;
    private long totalAircraft;
    private long availableGates;
    private long availableRunways;
    private long availableBelts;
    private long totalStaff;
    private List<FlightDTO> recentFlights;
}
