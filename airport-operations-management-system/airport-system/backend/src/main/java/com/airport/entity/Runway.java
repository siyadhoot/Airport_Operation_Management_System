package com.airport.entity;

import jakarta.persistence.*;
import lombok.*;

// ============================================================
//  RUNWAY
// ============================================================

/**
 * Runway — for aircraft take-off and landing operations.
 *
 * OOP - ABSTRACTION: Concrete implementation of AirportResource.
 * OOP - ENCAPSULATION: All fields private, state changed only through assign/release.
 */
@Entity
@Table(name = "runways")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Runway extends AirportResource {

    @Column(name = "runway_code", nullable = false, unique = true)
    private String runwayCode;

    @Column(name = "length_meters", nullable = false)
    private int lengthMeters;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RunwayStatus status = RunwayStatus.AVAILABLE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_flight_id")
    private Flight currentFlight;

    @Override
    public void assign(Flight flight) {
        if (!checkAvailability()) {
            throw new IllegalStateException("Runway " + runwayCode + " is not available.");
        }
        this.currentFlight = flight;
        this.status = RunwayStatus.IN_USE;
    }

    @Override
    public void release() {
        this.currentFlight = null;
        this.status = RunwayStatus.AVAILABLE;
    }

    @Override
    public boolean checkAvailability() {
        return this.status == RunwayStatus.AVAILABLE;
    }

    @Override
    public String getResourceCode() {
        return runwayCode;
    }

    public enum RunwayStatus { AVAILABLE, IN_USE, MAINTENANCE, CLOSED }
}
