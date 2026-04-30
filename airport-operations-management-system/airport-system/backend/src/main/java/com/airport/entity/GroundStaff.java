package com.airport.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("GroundStaff")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class GroundStaff extends Staff {

    @Column(name = "area_assigned")
    private String areaAssigned;

    @Override
    public String getStaffType() { return "GroundStaff"; }
}
