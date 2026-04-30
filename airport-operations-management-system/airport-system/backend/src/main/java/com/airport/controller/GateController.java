package com.airport.controller;

import com.airport.dto.GateCreateRequest;
import com.airport.dto.GateDTO;
import com.airport.dto.ResourceAssignRequest;
import com.airport.service.GateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ============================================================
//  GATE CONTROLLER  → /gates
// ============================================================
@RestController
@RequestMapping("/gates")
@RequiredArgsConstructor
public class GateController {

    private final GateService gateService;

    @GetMapping
    public ResponseEntity<List<GateDTO>> getAll() {
        return ResponseEntity.ok(gateService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GateDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(gateService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<GateDTO> create(@Valid @RequestBody GateCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(gateService.create(req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<GateDTO> update(
            @PathVariable Long id, @Valid @RequestBody GateCreateRequest req) {
        return ResponseEntity.ok(gateService.update(id, req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/assign")
    public ResponseEntity<GateDTO> assign(
            @PathVariable Long id, @Valid @RequestBody ResourceAssignRequest req) {
        return ResponseEntity.ok(gateService.assignToFlight(id, req.getFlightId()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/release")
    public ResponseEntity<GateDTO> release(@PathVariable Long id) {
        return ResponseEntity.ok(gateService.releaseGate(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        gateService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
