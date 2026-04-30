package com.airport.controller;

import com.airport.dto.BookingCreateRequest;
import com.airport.dto.BookingDTO;
import com.airport.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ============================================================
//  BOOKING CONTROLLER  → /bookings
// ============================================================
@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAll() {
        return ResponseEntity.ok(bookingService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getById(id));
    }

    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<List<BookingDTO>> getByPassenger(@PathVariable Long passengerId) {
        return ResponseEntity.ok(bookingService.getByPassenger(passengerId));
    }

    @GetMapping("/flight/{flightId}")
    public ResponseEntity<List<BookingDTO>> getByFlight(@PathVariable Long flightId) {
        return ResponseEntity.ok(bookingService.getByFlight(flightId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<BookingDTO> create(@Valid @RequestBody BookingCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.create(req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingDTO> updateStatus(
            @PathVariable Long id, @RequestParam String value) {
        return ResponseEntity.ok(bookingService.updateStatus(id, value));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
