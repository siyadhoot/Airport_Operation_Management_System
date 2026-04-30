package com.airport.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("Pilot")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Pilot extends Staff {

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "flight_hours")
    private int flightHours = 0;

    @Override
    public String getStaffType() { return "Pilot"; }
}
