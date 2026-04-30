package com.airport.controller;

import com.airport.dto.FlightCreateRequest;
import com.airport.dto.FlightDTO;
import com.airport.service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ============================================================
//  FLIGHT CONTROLLER  → /flights
// ============================================================
@RestController
@RequestMapping("/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @GetMapping
    public ResponseEntity<List<FlightDTO>> getAll(
            @RequestParam(required = false) String status) {
        if (status != null)
            return ResponseEntity.ok(flightService.getFlightsByStatus(status));
        return ResponseEntity.ok(flightService.getAllFlights());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlightDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(flightService.getFlightById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<FlightDTO> create(@Valid @RequestBody FlightCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(flightService.createFlight(req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<FlightDTO> update(
            @PathVariable Long id, @Valid @RequestBody FlightCreateRequest req) {
        return ResponseEntity.ok(flightService.updateFlight(id, req));
    }

    /**
     * PATCH /flights/{id}/status?value=DELAYED — update just the status
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<FlightDTO> updateStatus(
            @PathVariable Long id, @RequestParam String value) {
        return ResponseEntity.ok(flightService.updateStatus(id, value));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        flightService.deleteFlight(id);
        return ResponseEntity.noContent().build();
    }
}
