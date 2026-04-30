package com.airport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PassengerDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String passportNumber;
    private String nationality;
}
