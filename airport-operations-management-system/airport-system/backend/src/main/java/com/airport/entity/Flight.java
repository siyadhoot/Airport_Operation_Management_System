package com.airport.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Base Flight entity — uses JPA SINGLE_TABLE inheritance strategy.
 *
 * OOP - INHERITANCE:
 *   DomesticFlight, InternationalFlight, CargoFlight, EmergencyFlight all extend this class.
 *   Shared fields (flightNumber, origin, destination, timing, status) live here.
 *
 * OOP - POLYMORPHISM:
 *   calculatePriority() is overridden in each subclass.
 *
 * OOP - ENCAPSULATION:
 *   All fields are private; access controlled via public getters/setters (Lombok @Data).
 */
@Entity
@Table(name = "flights")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "flight_number", nullable = false, unique = true)
    private String flightNumber;

    @Column(nullable = false)
    private String origin;

    @Column(nullable = false)
    private String destination;

    @Column(name = "departure_time", nullable = false)
    private LocalDateTime departureTime;

    @Column(name = "arrival_time", nullable = false)
    private LocalDateTime arrivalTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FlightStatus status = FlightStatus.SCHEDULED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aircraft_id")
    private Aircraft aircraft;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * OOP - POLYMORPHISM:
     * Each subclass overrides this method to return an appropriate priority value.
     * EmergencyFlight always returns the highest priority (Integer.MAX_VALUE).
     *
     * @return integer priority — higher = more urgent
     */
    public abstract int calculatePriority();

    /** Flight status lifecycle */
    public enum FlightStatus {
        SCHEDULED, BOARDING, DEPARTED, ARRIVED, DELAYED, CANCELLED, EMERGENCY
    }
}
