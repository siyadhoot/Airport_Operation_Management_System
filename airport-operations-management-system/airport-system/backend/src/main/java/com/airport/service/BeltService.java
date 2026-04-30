package com.airport.service;

import com.airport.dto.BeltCreateRequest;
import com.airport.dto.BeltDTO;
import com.airport.entity.BaggageBelt;
import com.airport.entity.Flight;
import com.airport.repository.BaggageBeltRepository;
import com.airport.repository.FlightRepository;
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
public class BeltService {

    private final BaggageBeltRepository beltRepository;
    private final FlightRepository flightRepository;

    @Transactional(readOnly = true)
    public List<BeltDTO> getAll() {
        return beltRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BeltDTO getById(Long id) { return toDTO(findOrThrow(id)); }

    public BeltDTO create(BeltCreateRequest req) {
        BaggageBelt b = new BaggageBelt();
        b.setBeltCode(req.getBeltCode());
        b.setTerminal(req.getTerminal());
        b.setStatus(BaggageBelt.BeltStatus.AVAILABLE);
        return toDTO(beltRepository.save(b));
    }

    public BeltDTO update(Long id, BeltCreateRequest req) {
        BaggageBelt b = findOrThrow(id);
        b.setBeltCode(req.getBeltCode());
        b.setTerminal(req.getTerminal());
        return toDTO(beltRepository.save(b));
    }

    public BeltDTO assignToFlight(Long beltId, Long flightId) {
        BaggageBelt belt = findOrThrow(beltId);
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new EntityNotFoundException("Flight not found"));
        belt.assign(flight);
        return toDTO(beltRepository.save(belt));
    }

    public BeltDTO releaseBelt(Long beltId) {
        BaggageBelt belt = findOrThrow(beltId);
        belt.release();
        return toDTO(beltRepository.save(belt));
    }

    public void delete(Long id) { beltRepository.deleteById(id); }

    private BaggageBelt findOrThrow(Long id) {
        return beltRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Belt not found: " + id));
    }

    private BeltDTO toDTO(BaggageBelt b) {
        BeltDTO.BeltDTOBuilder builder = BeltDTO.builder()
                .id(b.getId()).beltCode(b.getBeltCode())
                .terminal(b.getTerminal()).status(b.getStatus().name());
        if (b.getCurrentFlight() != null) {
            builder.currentFlightId(b.getCurrentFlight().getId());
            builder.currentFlightNumber(b.getCurrentFlight().getFlightNumber());
        }
        return builder.build();
    }
}
