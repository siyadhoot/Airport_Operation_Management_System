package com.airport.service;

import com.airport.dto.BookingCreateRequest;
import com.airport.dto.BookingDTO;
import com.airport.entity.Booking;
import com.airport.entity.Flight;
import com.airport.entity.Passenger;
import com.airport.repository.BookingRepository;
import com.airport.repository.FlightRepository;
import com.airport.repository.PassengerRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PassengerRepository passengerRepository;
    private final FlightRepository flightRepository;

    @Transactional(readOnly = true)
    public List<BookingDTO> getAll() {
        return bookingRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingDTO getById(Long id) { return toDTO(findOrThrow(id)); }

    @Transactional(readOnly = true)
    public List<BookingDTO> getByPassenger(Long passengerId) {
        return bookingRepository.findByPassengerId(passengerId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getByFlight(Long flightId) {
        return bookingRepository.findByFlightId(flightId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public BookingDTO create(BookingCreateRequest req) {
        Passenger passenger = passengerRepository.findById(req.getPassengerId())
                .orElseThrow(() -> new EntityNotFoundException("Passenger not found"));
        Flight flight = flightRepository.findById(req.getFlightId())
                .orElseThrow(() -> new EntityNotFoundException("Flight not found"));

        if (bookingRepository.existsByPassengerIdAndFlightId(req.getPassengerId(), req.getFlightId()))
            throw new IllegalArgumentException("Passenger already booked on this flight");

        Booking booking = Booking.builder()
                .passenger(passenger).flight(flight)
                .seatNumber(req.getSeatNumber())
                .status(Booking.BookingStatus.CONFIRMED)
                .bookingReference("BK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();
        return toDTO(bookingRepository.save(booking));
    }

    public BookingDTO updateStatus(Long id, String status) {
        Booking b = findOrThrow(id);
        b.setStatus(Booking.BookingStatus.valueOf(status.toUpperCase()));
        return toDTO(bookingRepository.save(b));
    }

    public void delete(Long id) { bookingRepository.deleteById(id); }

    private Booking findOrThrow(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found: " + id));
    }

    private BookingDTO toDTO(Booking b) {
        return BookingDTO.builder()
                .id(b.getId()).bookingReference(b.getBookingReference())
                .passengerId(b.getPassenger().getId()).passengerName(b.getPassenger().getName())
                .flightId(b.getFlight().getId()).flightNumber(b.getFlight().getFlightNumber())
                .seatNumber(b.getSeatNumber()).status(b.getStatus().name())
                .bookingTime(b.getBookingTime()).build();
    }
}
