package com.airport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffDTO {
    private Long id;
    private String dtype;
    private String name;
    private String employeeId;
    private String email;
    private String phone;
    private String status;
    private String staffType;
    // Subclass-specific
    private String licenseNumber;
    private Integer flightHours;
    private String areaAssigned;
    private String languageSkills;
}
