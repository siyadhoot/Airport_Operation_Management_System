package com.airport.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Abstract base class for airport physical resources.
 *
 * OOP - ABSTRACTION:
 *   Defines a contract (abstract methods) that Gate, Runway, and BaggageBelt
 *   must fulfil. Internal allocation logic is hidden from consumers.
 */
@MappedSuperclass
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class AirportResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Assign this resource to a flight.
     * Concrete subclasses implement their own allocation rules.
     */
    public abstract void assign(Flight flight);

    /**
     * Release this resource (mark as available).
     */
    public abstract void release();

    /**
     * Check whether this resource can currently be assigned.
     */
    public abstract boolean checkAvailability();

    /**
     * Returns a human-readable code/identifier for this resource.
     */
    public abstract String getResourceCode();
}
