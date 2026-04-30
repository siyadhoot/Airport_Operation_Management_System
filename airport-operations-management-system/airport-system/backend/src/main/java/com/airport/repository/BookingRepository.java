package com.airport.repository;

import com.airport.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findByPassengerId(Long passengerId);
    List<Booking> findByFlightId(Long flightId);
    List<Booking> findByStatus(Booking.BookingStatus status);
    boolean existsByPassengerIdAndFlightId(Long passengerId, Long flightId);
}
