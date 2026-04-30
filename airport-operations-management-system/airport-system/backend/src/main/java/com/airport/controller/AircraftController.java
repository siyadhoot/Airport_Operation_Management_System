package com.airport.controller;

import com.airport.dto.AircraftCreateRequest;
import com.airport.dto.AircraftDTO;
import com.airport.service.AircraftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ============================================================
//  AIRCRAFT CONTROLLER  → /aircraft
// ============================================================
@RestController
@RequestMapping("/aircraft")
@RequiredArgsConstructor
public class AircraftController {

    private final AircraftService aircraftService;

    @GetMapping
    public ResponseEntity<List<AircraftDTO>> getAll() {
        return ResponseEntity.ok(aircraftService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AircraftDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(aircraftService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<AircraftDTO> create(@Valid @RequestBody AircraftCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(aircraftService.create(req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<AircraftDTO> update(
            @PathVariable Long id, @Valid @RequestBody AircraftCreateRequest req) {
        return ResponseEntity.ok(aircraftService.update(id, req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<AircraftDTO> updateStatus(
            @PathVariable Long id, @RequestParam String value) {
        return ResponseEntity.ok(aircraftService.updateStatus(id, value));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        aircraftService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
