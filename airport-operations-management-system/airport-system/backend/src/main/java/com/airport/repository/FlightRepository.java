package com.airport.repository;

import com.airport.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    Optional<Flight> findByFlightNumber(String flightNumber);

    @Query("SELECT f FROM Flight f WHERE f.status = :status")
    List<Flight> findByStatus(@Param("status") Flight.FlightStatus status);

    @Query("SELECT f FROM Flight f WHERE f.departureTime BETWEEN :start AND :end")
    List<Flight> findByDepartureTimeBetween(
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );

    @Query("SELECT f FROM Flight f WHERE f.aircraft.id = :aircraftId")
    List<Flight> findByAircraftId(@Param("aircraftId") Long aircraftId);

    long countByStatus(Flight.FlightStatus status);
}
