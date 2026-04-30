package com.airport.service;

import com.airport.dto.PassengerCreateRequest;
import com.airport.dto.PassengerDTO;
import com.airport.entity.Passenger;
import com.airport.repository.PassengerRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PassengerService {

    private final PassengerRepository passengerRepository;

    @Transactional(readOnly = true)
    public List<PassengerDTO> getAll() {
        return passengerRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PassengerDTO getById(Long id) { return toDTO(findOrThrow(id)); }

    public PassengerDTO create(PassengerCreateRequest req) {
        if (passengerRepository.existsByEmail(req.getEmail()))
            throw new IllegalArgumentException("Email already registered");
        Passenger p = Passenger.builder()
                .name(req.getName()).email(req.getEmail())
                .phone(req.getPhone()).passportNumber(req.getPassportNumber())
                .nationality(req.getNationality()).build();
        return toDTO(passengerRepository.save(p));
    }

    public PassengerDTO update(Long id, PassengerCreateRequest req) {
        Passenger p = findOrThrow(id);
        p.setName(req.getName()); p.setPhone(req.getPhone());
        p.setPassportNumber(req.getPassportNumber()); p.setNationality(req.getNationality());
        return toDTO(passengerRepository.save(p));
    }

    public void delete(Long id) { passengerRepository.deleteById(id); }

    private Passenger findOrThrow(Long id) {
        return passengerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Passenger not found: " + id));
    }

    private PassengerDTO toDTO(Passenger p) {
        return PassengerDTO.builder()
                .id(p.getId()).name(p.getName()).email(p.getEmail())
                .phone(p.getPhone()).passportNumber(p.getPassportNumber())
                .nationality(p.getNationality()).build();
    }
}
