package com.airport.controller;

import com.airport.dto.BeltCreateRequest;
import com.airport.dto.BeltDTO;
import com.airport.dto.ResourceAssignRequest;
import com.airport.service.BeltService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ============================================================
//  BELT CONTROLLER  → /belts
// ============================================================
@RestController
@RequestMapping("/belts")
@RequiredArgsConstructor
public class BeltController {

    private final BeltService beltService;

    @GetMapping
    public ResponseEntity<List<BeltDTO>> getAll() {
        return ResponseEntity.ok(beltService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BeltDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(beltService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<BeltDTO> create(@Valid @RequestBody BeltCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(beltService.create(req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<BeltDTO> update(
            @PathVariable Long id, @Valid @RequestBody BeltCreateRequest req) {
        return ResponseEntity.ok(beltService.update(id, req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/assign")
    public ResponseEntity<BeltDTO> assign(
            @PathVariable Long id, @Valid @RequestBody ResourceAssignRequest req) {
        return ResponseEntity.ok(beltService.assignToFlight(id, req.getFlightId()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/release")
    public ResponseEntity<BeltDTO> release(@PathVariable Long id) {
        return ResponseEntity.ok(beltService.releaseBelt(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        beltService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
