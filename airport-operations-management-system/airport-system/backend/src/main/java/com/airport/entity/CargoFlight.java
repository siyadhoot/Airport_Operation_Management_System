package com.airport.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Represents a cargo/freight-only flight.
 * OOP - INHERITANCE: extends Flight.
 * OOP - POLYMORPHISM: overrides calculatePriority() with cargo logic.
 */
@Entity
@DiscriminatorValue("CargoFlight")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class CargoFlight extends Flight {

    @Column(name = "cargo_weight_kg")
    private Double cargoWeightKg;

    @Column(name = "cargo_type")
    private String cargoType; // e.g., "Perishables", "Machinery", "Medical"

    @Override
    public int calculatePriority() {
        // Cargo flights: base 1, boost for medical cargo
        if ("Medical".equalsIgnoreCase(cargoType)) return 3;
        return 1;
    }
}
