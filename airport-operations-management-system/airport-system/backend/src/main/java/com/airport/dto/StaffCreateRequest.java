package com.airport.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffCreateRequest {
    @NotBlank
    private String dtype;   // Pilot | GroundStaff | AirHostess
    @NotBlank
    private String name;
    @NotBlank
    private String employeeId;
    @Email
    private String email;
    private String phone;
    // Subclass-specific
    private String licenseNumber;
    private Integer flightHours;
    private String areaAssigned;
    private String languageSkills;
}
