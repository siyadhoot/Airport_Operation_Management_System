package com.airport.entity;

import jakarta.persistence.*;
import lombok.*;

// ============================================================
//  BAGGAGE BELT
// ============================================================

/**
 * BaggageBelt — baggage reclaim belt in arrivals hall.
 *
 * OOP - ABSTRACTION: Concrete implementation of AirportResource.
 */
@Entity
@Table(name = "baggage_belts")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class BaggageBelt extends AirportResource {

    @Column(name = "belt_code", nullable = false, unique = true)
    private String beltCode;

    @Column(nullable = false)
    private String terminal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BeltStatus status = BeltStatus.AVAILABLE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_flight_id")
    private Flight currentFlight;

    @Override
    public void assign(Flight flight) {
        if (!checkAvailability()) {
            throw new IllegalStateException("Belt " + beltCode + " is not available.");
        }
        this.currentFlight = flight;
        this.status = BeltStatus.ACTIVE;
    }

    @Override
    public void release() {
        this.currentFlight = null;
        this.status = BeltStatus.AVAILABLE;
    }

    @Override
    public boolean checkAvailability() {
        return this.status == BeltStatus.AVAILABLE;
    }

    @Override
    public String getResourceCode() {
        return beltCode;
    }

    public enum BeltStatus { AVAILABLE, ACTIVE, MAINTENANCE }
}
