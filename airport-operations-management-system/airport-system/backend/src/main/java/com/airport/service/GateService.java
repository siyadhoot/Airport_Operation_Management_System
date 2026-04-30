package com.airport.service;

import com.airport.dto.GateCreateRequest;
import com.airport.dto.GateDTO;
import com.airport.entity.Flight;
import com.airport.entity.Gate;
import com.airport.repository.FlightRepository;
import com.airport.repository.GateRepository;
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
public class GateService {

    private final GateRepository gateRepository;
    private final FlightRepository flightRepository;

    @Transactional(readOnly = true)
    public List<GateDTO> getAll() {
        return gateRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GateDTO getById(Long id) {
        return toDTO(findOrThrow(id));
    }

    public GateDTO create(GateCreateRequest req) {
        Gate gate = new Gate();
        gate.setGateCode(req.getGateCode());
        gate.setTerminal(req.getTerminal());
        gate.setStatus(Gate.GateStatus.AVAILABLE);
        return toDTO(gateRepository.save(gate));
    }

    public GateDTO update(Long id, GateCreateRequest req) {
        Gate g = findOrThrow(id);
        g.setGateCode(req.getGateCode());
        g.setTerminal(req.getTerminal());
        return toDTO(gateRepository.save(g));
    }

    /** Assign gate to a flight (uses AirportResource.assign()) */
    public GateDTO assignToFlight(Long gateId, Long flightId) {
        Gate gate = findOrThrow(gateId);
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new EntityNotFoundException("Flight not found"));
        gate.assign(flight);  // polymorphic call via abstract method
        return toDTO(gateRepository.save(gate));
    }

    /** Release gate (uses AirportResource.release()) */
    public GateDTO releaseGate(Long gateId) {
        Gate gate = findOrThrow(gateId);
        gate.release();
        return toDTO(gateRepository.save(gate));
    }

    public void delete(Long id) { gateRepository.deleteById(id); }

    private Gate findOrThrow(Long id) {
        return gateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Gate not found: " + id));
    }

    private GateDTO toDTO(Gate g) {
        GateDTO.GateDTOBuilder b = GateDTO.builder()
                .id(g.getId()).gateCode(g.getGateCode())
                .terminal(g.getTerminal()).status(g.getStatus().name());
        if (g.getCurrentFlight() != null) {
            b.currentFlightId(g.getCurrentFlight().getId());
            b.currentFlightNumber(g.getCurrentFlight().getFlightNumber());
        }
        return b.build();
    }
}
