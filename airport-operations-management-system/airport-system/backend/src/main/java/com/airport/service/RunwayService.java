package com.airport.service;

import com.airport.dto.RunwayCreateRequest;
import com.airport.dto.RunwayDTO;
import com.airport.entity.Flight;
import com.airport.entity.Runway;
import com.airport.repository.FlightRepository;
import com.airport.repository.RunwayRepository;
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
public class RunwayService {

    private final RunwayRepository runwayRepository;
    private final FlightRepository flightRepository;

    @Transactional(readOnly = true)
    public List<RunwayDTO> getAll() {
        return runwayRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RunwayDTO getById(Long id) { return toDTO(findOrThrow(id)); }

    public RunwayDTO create(RunwayCreateRequest req) {
        Runway r = new Runway();
        r.setRunwayCode(req.getRunwayCode());
        r.setLengthMeters(req.getLengthMeters());
        r.setStatus(Runway.RunwayStatus.AVAILABLE);
        return toDTO(runwayRepository.save(r));
    }

    public RunwayDTO update(Long id, RunwayCreateRequest req) {
        Runway r = findOrThrow(id);
        r.setRunwayCode(req.getRunwayCode());
        r.setLengthMeters(req.getLengthMeters());
        return toDTO(runwayRepository.save(r));
    }

    public RunwayDTO assignToFlight(Long runwayId, Long flightId) {
        Runway runway = findOrThrow(runwayId);
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new EntityNotFoundException("Flight not found"));
        runway.assign(flight);
        return toDTO(runwayRepository.save(runway));
    }

    public RunwayDTO releaseRunway(Long runwayId) {
        Runway runway = findOrThrow(runwayId);
        runway.release();
        return toDTO(runwayRepository.save(runway));
    }

    public void delete(Long id) { runwayRepository.deleteById(id); }

    private Runway findOrThrow(Long id) {
        return runwayRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Runway not found: " + id));
    }

    private RunwayDTO toDTO(Runway r) {
        RunwayDTO.RunwayDTOBuilder b = RunwayDTO.builder()
                .id(r.getId()).runwayCode(r.getRunwayCode())
                .lengthMeters(r.getLengthMeters()).status(r.getStatus().name());
        if (r.getCurrentFlight() != null) {
            b.currentFlightId(r.getCurrentFlight().getId());
            b.currentFlightNumber(r.getCurrentFlight().getFlightNumber());
        }
        return b.build();
    }
}
