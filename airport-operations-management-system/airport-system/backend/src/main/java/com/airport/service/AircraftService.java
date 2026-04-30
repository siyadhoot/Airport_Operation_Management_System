package com.airport.service;

import com.airport.dto.AircraftCreateRequest;
import com.airport.dto.AircraftDTO;
import com.airport.entity.Aircraft;
import com.airport.repository.AircraftRepository;
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
public class AircraftService {

    private final AircraftRepository aircraftRepository;

    @Transactional(readOnly = true)
    public List<AircraftDTO> getAll() {
        return aircraftRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AircraftDTO getById(Long id) {
        return toDTO(findOrThrow(id));
    }

    public AircraftDTO create(AircraftCreateRequest req) {
        if (aircraftRepository.existsByRegistrationNumber(req.getRegistrationNumber()))
            throw new IllegalArgumentException("Registration already exists");
        Aircraft a = Aircraft.builder()
                .registrationNumber(req.getRegistrationNumber())
                .model(req.getModel())
                .manufacturer(req.getManufacturer())
                .capacity(req.getCapacity())
                .status(Aircraft.AircraftStatus.AVAILABLE)
                .build();
        return toDTO(aircraftRepository.save(a));
    }

    public AircraftDTO update(Long id, AircraftCreateRequest req) {
        Aircraft a = findOrThrow(id);
        a.setModel(req.getModel());
        a.setManufacturer(req.getManufacturer());
        a.setCapacity(req.getCapacity());
        return toDTO(aircraftRepository.save(a));
    }

    public AircraftDTO updateStatus(Long id, String status) {
        Aircraft a = findOrThrow(id);
        a.setStatus(Aircraft.AircraftStatus.valueOf(status.toUpperCase()));
        return toDTO(aircraftRepository.save(a));
    }

    public void delete(Long id) {
        aircraftRepository.deleteById(id);
    }

    private Aircraft findOrThrow(Long id) {
        return aircraftRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Aircraft not found: " + id));
    }

    private AircraftDTO toDTO(Aircraft a) {
        return AircraftDTO.builder()
                .id(a.getId()).registrationNumber(a.getRegistrationNumber())
                .model(a.getModel()).manufacturer(a.getManufacturer())
                .capacity(a.getCapacity()).status(a.getStatus().name())
                .build();
    }
}
