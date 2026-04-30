package com.airport.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

// ============================================================
//  AIRCRAFT
// ============================================================

/**
 * Aircraft — physical airplane registered to fly routes.
 * OOP - ENCAPSULATION: private fields, controlled access.
 */
@Entity
@Table(name = "aircraft")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Aircraft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "registration_number", nullable = false, unique = true)
    private String registrationNumber;

    @Column(nullable = false)
    private String model;

    private String manufacturer;

    @Column(nullable = false)
    private int capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AircraftStatus status = AircraftStatus.AVAILABLE;

    /** One aircraft may be used across many flights (historically) */
    @OneToMany(mappedBy = "aircraft", fetch = FetchType.LAZY)
    private List<Flight> flights;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist protected void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate  protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public enum AircraftStatus { AVAILABLE, IN_SERVICE, MAINTENANCE, GROUNDED }
}
