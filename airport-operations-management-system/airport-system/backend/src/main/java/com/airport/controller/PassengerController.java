package com.airport.controller;

import com.airport.dto.PassengerCreateRequest;
import com.airport.dto.PassengerDTO;
import com.airport.service.PassengerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ============================================================
//  PASSENGER CONTROLLER  → /passengers
// ============================================================
@RestController
@RequestMapping("/passengers")
@RequiredArgsConstructor
public class PassengerController {

    private final PassengerService passengerService;

    @GetMapping
    public ResponseEntity<List<PassengerDTO>> getAll() {
        return ResponseEntity.ok(passengerService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PassengerDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(passengerService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PassengerDTO> create(@Valid @RequestBody PassengerCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(passengerService.create(req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<PassengerDTO> update(
            @PathVariable Long id, @Valid @RequestBody PassengerCreateRequest req) {
        return ResponseEntity.ok(passengerService.update(id, req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        passengerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
