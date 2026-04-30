package com.airport.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Represents a domestic flight within the country.
 * OOP - INHERITANCE: extends Flight, inherits all base properties.
 * OOP - POLYMORPHISM: overrides calculatePriority() with domestic logic.
 */
@Entity
@DiscriminatorValue("DomesticFlight")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class DomesticFlight extends Flight {

    /** Geographic zone (e.g., North, South, East, West) */
    @Column(name = "zone")
    private String zone;

    @Override
    public int calculatePriority() {
        // Domestic flights get base priority of 1
        return 1;
    }
}
