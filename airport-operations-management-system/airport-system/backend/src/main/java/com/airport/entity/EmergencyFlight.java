package com.airport.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Represents an emergency flight — highest operational priority.
 *
 * OOP - POLYMORPHISM:
 *   calculatePriority() returns Integer.MAX_VALUE, ensuring this flight
 *   always pre-empts all others in scheduling and resource allocation.
 */
@Entity
@DiscriminatorValue("EmergencyFlight")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyFlight extends Flight {

    @Column(name = "emergency_reason")
    private String emergencyReason;

    @Column(name = "priority_level")
    private int priorityLevel = 10; // configurable emergency severity

    @Override
    public int calculatePriority() {
        // ALWAYS highest priority — overrides all other flights
        return Integer.MAX_VALUE;
    }
}
