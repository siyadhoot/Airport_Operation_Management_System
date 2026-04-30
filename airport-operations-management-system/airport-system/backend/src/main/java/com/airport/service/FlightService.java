package com.airport.service;

import com.airport.config.FlightStatusPublisher;
import com.airport.dto.FlightCreateRequest;
import com.airport.dto.FlightDTO;
import com.airport.entity.*;
import com.airport.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * FlightService — business logic for flight management.
 * Handles creation of correct Flight subclass based on dtype.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FlightService {

    private final FlightRepository flightRepository;
    private final AircraftRepository aircraftRepository;
    private final FlightStatusPublisher publisher;

    /** Retrieve all flights mapped to DTOs */
    @Transactional(readOnly = true)
    public List<FlightDTO> getAllFlights() {
        return flightRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /** Retrieve a single flight by ID */
    @Transactional(readOnly = true)
    public FlightDTO getFlightById(Long id) {
        return toDTO(findOrThrow(id));
    }

    /** Create a new flight — dispatches to the correct subclass */
    public FlightDTO createFlight(FlightCreateRequest req) {
        if (flightRepository.findByFlightNumber(req.getFlightNumber()).isPresent()) {
            throw new IllegalArgumentException("Flight number already exists: " + req.getFlightNumber());
        }
        Flight flight = buildFlight(req);
        return toDTO(flightRepository.save(flight));
    }

    /** Update an existing flight */
    public FlightDTO updateFlight(Long id, FlightCreateRequest req) {
        Flight existing = findOrThrow(id);
        // Update common fields
        existing.setOrigin(req.getOrigin());
        existing.setDestination(req.getDestination());
        existing.setDepartureTime(req.getDepartureTime());
        existing.setArrivalTime(req.getArrivalTime());

        if (req.getAircraftId() != null) {
            Aircraft aircraft = aircraftRepository.findById(req.getAircraftId())
                    .orElseThrow(() -> new EntityNotFoundException("Aircraft not found"));
            existing.setAircraft(aircraft);
        }

        // Update subclass-specific fields
        applySubclassFields(existing, req);

        FlightDTO dto = toDTO(flightRepository.save(existing));
        publisher.broadcastFlightUpdate(dto); // push live update via WebSocket
        return dto;
    }

    /** Update only the flight status (used by operations) */
    public FlightDTO updateStatus(Long id, String status) {
        Flight flight = findOrThrow(id);
        flight.setStatus(Flight.FlightStatus.valueOf(status.toUpperCase()));
        FlightDTO dto = toDTO(flightRepository.save(flight));
        publisher.broadcastFlightUpdate(dto); // push live update
        return dto;
    }

    /** Delete a flight */
    public void deleteFlight(Long id) {
        if (!flightRepository.existsById(id)) {
            throw new EntityNotFoundException("Flight not found with id: " + id);
        }
        flightRepository.deleteById(id);
    }

    /** Get flights by status */
    @Transactional(readOnly = true)
    public List<FlightDTO> getFlightsByStatus(String status) {
        return flightRepository.findByStatus(Flight.FlightStatus.valueOf(status.toUpperCase()))
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ---- Helpers ----

    private Flight findOrThrow(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Flight not found: " + id));
    }

    /**
     * Factory method — creates the correct subclass based on dtype.
     * Demonstrates OOP Polymorphism through runtime dispatch.
     */
    private Flight buildFlight(FlightCreateRequest req) {
        Aircraft aircraft = null;
        if (req.getAircraftId() != null) {
            aircraft = aircraftRepository.findById(req.getAircraftId())
                    .orElseThrow(() -> new EntityNotFoundException("Aircraft not found"));
        }

        return switch (req.getDtype()) {
            case "DomesticFlight" -> {
                DomesticFlight f = new DomesticFlight();
                applyBase(f, req, aircraft);
                f.setZone(req.getZone());
                yield f;
            }
            case "InternationalFlight" -> {
                InternationalFlight f = new InternationalFlight();
                applyBase(f, req, aircraft);
                f.setCountryCode(req.getCountryCode());
                f.setCustomsRequired(Boolean.TRUE.equals(req.getCustomsRequired()));
                yield f;
            }
            case "CargoFlight" -> {
                CargoFlight f = new CargoFlight();
                applyBase(f, req, aircraft);
                f.setCargoWeightKg(req.getCargoWeightKg());
                f.setCargoType(req.getCargoType());
                yield f;
            }
            case "EmergencyFlight" -> {
                EmergencyFlight f = new EmergencyFlight();
                applyBase(f, req, aircraft);
                f.setEmergencyReason(req.getEmergencyReason());
                f.setPriorityLevel(req.getPriorityLevel() != null ? req.getPriorityLevel() : 10);
                yield f;
            }
            default -> throw new IllegalArgumentException("Unknown flight type: " + req.getDtype());
        };
    }

    private void applyBase(Flight f, FlightCreateRequest req, Aircraft aircraft) {
        f.setFlightNumber(req.getFlightNumber());
        f.setOrigin(req.getOrigin());
        f.setDestination(req.getDestination());
        f.setDepartureTime(req.getDepartureTime());
        f.setArrivalTime(req.getArrivalTime());
        f.setStatus(Flight.FlightStatus.SCHEDULED);
        f.setAircraft(aircraft);
    }

    private void applySubclassFields(Flight f, FlightCreateRequest req) {
        if (f instanceof DomesticFlight df && req.getZone() != null)
            df.setZone(req.getZone());
        if (f instanceof InternationalFlight ifl) {
            if (req.getCountryCode() != null) ifl.setCountryCode(req.getCountryCode());
            if (req.getCustomsRequired() != null) ifl.setCustomsRequired(req.getCustomsRequired());
        }
        if (f instanceof CargoFlight cf) {
            if (req.getCargoWeightKg() != null) cf.setCargoWeightKg(req.getCargoWeightKg());
            if (req.getCargoType() != null) cf.setCargoType(req.getCargoType());
        }
        if (f instanceof EmergencyFlight ef) {
            if (req.getEmergencyReason() != null) ef.setEmergencyReason(req.getEmergencyReason());
            if (req.getPriorityLevel() != null) ef.setPriorityLevel(req.getPriorityLevel());
        }
    }

    /** Map Flight entity (any subclass) to FlightDTO */
    public FlightDTO toDTO(Flight f) {
        FlightDTO.FlightDTOBuilder b = FlightDTO.builder()
                .id(f.getId())
                .dtype(f.getClass().getSimpleName())
                .flightNumber(f.getFlightNumber())
                .origin(f.getOrigin())
                .destination(f.getDestination())
                .departureTime(f.getDepartureTime())
                .arrivalTime(f.getArrivalTime())
                .status(f.getStatus().name())
                .priority(f.calculatePriority());

        if (f.getAircraft() != null) {
            b.aircraftId(f.getAircraft().getId());
            b.aircraftRegistration(f.getAircraft().getRegistrationNumber());
        }
        if (f instanceof DomesticFlight df)       b.zone(df.getZone());
        if (f instanceof InternationalFlight ifl) { b.countryCode(ifl.getCountryCode()); b.customsRequired(ifl.isCustomsRequired()); }
        if (f instanceof CargoFlight cf)          { b.cargoWeightKg(cf.getCargoWeightKg()); b.cargoType(cf.getCargoType()); }
        if (f instanceof EmergencyFlight ef)      { b.emergencyReason(ef.getEmergencyReason()); b.priorityLevel(ef.getPriorityLevel()); }

        return b.build();
    }
}
