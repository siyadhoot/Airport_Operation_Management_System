package com.airport.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Gate — a physical boarding gate at the airport.
 *
 * OOP - ABSTRACTION:
 *   Extends AirportResource and provides concrete implementations
 *   of assign(), release(), and checkAvailability().
 *
 * OOP - ENCAPSULATION:
 *   gateStatus and currentFlight are private; modified only through
 *   controlled methods.
 */
@Entity
@Table(name = "gates")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Gate extends AirportResource {

    @Column(name = "gate_code", nullable = false, unique = true)
    private String gateCode;

    @Column(nullable = false)
    private String terminal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GateStatus status = GateStatus.AVAILABLE;

    /** Flight currently occupying this gate (nullable when available) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_flight_id")
    private Flight currentFlight;

    // ---- AirportResource contract ----

    @Override
    public void assign(Flight flight) {
        if (!checkAvailability()) {
            throw new IllegalStateException("Gate " + gateCode + " is not available.");
        }
        this.currentFlight = flight;
        this.status = GateStatus.OCCUPIED;
    }

    @Override
    public void release() {
        this.currentFlight = null;
        this.status = GateStatus.AVAILABLE;
    }

    @Override
    public boolean checkAvailability() {
        return this.status == GateStatus.AVAILABLE;
    }

    @Override
    public String getResourceCode() {
        return gateCode;
    }

    /** Gate operational status */
    public enum GateStatus { AVAILABLE, OCCUPIED, MAINTENANCE }
}
