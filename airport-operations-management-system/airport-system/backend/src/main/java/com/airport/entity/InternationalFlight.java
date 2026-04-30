package com.airport.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Represents an international flight crossing country borders.
 * OOP - INHERITANCE: extends Flight.
 * OOP - POLYMORPHISM: overrides calculatePriority() — higher than domestic.
 */
@Entity
@DiscriminatorValue("InternationalFlight")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class InternationalFlight extends Flight {

    @Column(name = "country_code")
    private String countryCode;

    @Column(name = "customs_required")
    private boolean customsRequired = true;

    @Override
    public int calculatePriority() {
        // International flights have higher priority than domestic
        return 2;
    }
}
