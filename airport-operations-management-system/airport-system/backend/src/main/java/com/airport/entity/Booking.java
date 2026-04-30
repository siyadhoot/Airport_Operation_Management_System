package com.airport.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// ============================================================
//  BOOKING  (Passenger <-> Flight many-to-one join)
// ============================================================

/**
 * Booking — links a Passenger to a specific Flight.
 *
 * OOP:
 *   Demonstrates Many-to-One associations on both sides.
 *   Many bookings can belong to one passenger.
 *   Many bookings can belong to one flight.
 */
@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_reference", nullable = false, unique = true)
    private String bookingReference;

    /** Many bookings → one passenger */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passenger_id", nullable = false)
    private Passenger passenger;

    /** Many bookings → one flight */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(name = "seat_number")
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.CONFIRMED;

    @Column(name = "booking_time")
    private LocalDateTime bookingTime;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        bookingTime = LocalDateTime.now();
        createdAt = updatedAt = LocalDateTime.now();
        // Auto-generate booking reference if absent
        if (bookingReference == null || bookingReference.isBlank()) {
            bookingReference = "BK" + System.currentTimeMillis();
        }
    }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public enum BookingStatus { CONFIRMED, CANCELLED, CHECKED_IN, BOARDED }
}
