package com.airport.controller;

import com.airport.dto.ResourceAssignRequest;
import com.airport.dto.RunwayCreateRequest;
import com.airport.dto.RunwayDTO;
import com.airport.service.RunwayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ============================================================
//  RUNWAY CONTROLLER  → /runways
// ============================================================
@RestController
@RequestMapping("/runways")
@RequiredArgsConstructor
public class RunwayController {

    private final RunwayService runwayService;

    @GetMapping
    public ResponseEntity<List<RunwayDTO>> getAll() {
        return ResponseEntity.ok(runwayService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RunwayDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(runwayService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<RunwayDTO> create(@Valid @RequestBody RunwayCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(runwayService.create(req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<RunwayDTO> update(
            @PathVariable Long id, @Valid @RequestBody RunwayCreateRequest req) {
        return ResponseEntity.ok(runwayService.update(id, req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/assign")
    public ResponseEntity<RunwayDTO> assign(
            @PathVariable Long id, @Valid @RequestBody ResourceAssignRequest req) {
        return ResponseEntity.ok(runwayService.assignToFlight(id, req.getFlightId()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/release")
    public ResponseEntity<RunwayDTO> release(@PathVariable Long id) {
        return ResponseEntity.ok(runwayService.releaseRunway(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        runwayService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
