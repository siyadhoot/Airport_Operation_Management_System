package com.airport.service;

import com.airport.dto.DashboardDTO;
import com.airport.dto.FlightDTO;
import com.airport.entity.BaggageBelt;
import com.airport.entity.Flight;
import com.airport.entity.Gate;
import com.airport.entity.Runway;
import com.airport.repository.AircraftRepository;
import com.airport.repository.BaggageBeltRepository;
import com.airport.repository.BookingRepository;
import com.airport.repository.FlightRepository;
import com.airport.repository.GateRepository;
import com.airport.repository.PassengerRepository;
import com.airport.repository.RunwayRepository;
import com.airport.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DashboardService {

    private final FlightRepository flightRepository;
    private final PassengerRepository passengerRepository;
    private final BookingRepository bookingRepository;
    private final AircraftRepository aircraftRepository;
    private final GateRepository gateRepository;
    private final RunwayRepository runwayRepository;
    private final BaggageBeltRepository beltRepository;
    private final StaffRepository staffRepository;
    private final FlightService flightService;

    public DashboardDTO getDashboard() {
        List<FlightDTO> recent = flightRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(flightService::toDTO)
                .collect(Collectors.toList());

        return DashboardDTO.builder()
                .totalFlights(flightRepository.count())
                .scheduledFlights(flightRepository.countByStatus(Flight.FlightStatus.SCHEDULED))
                .delayedFlights(flightRepository.countByStatus(Flight.FlightStatus.DELAYED))
                .activeFlights(flightRepository.countByStatus(Flight.FlightStatus.BOARDING)
                        + flightRepository.countByStatus(Flight.FlightStatus.DEPARTED))
                .totalPassengers(passengerRepository.count())
                .totalBookings(bookingRepository.count())
                .totalAircraft(aircraftRepository.count())
                .availableGates(gateRepository.countByStatus(Gate.GateStatus.AVAILABLE))
                .availableRunways(runwayRepository.countByStatus(Runway.RunwayStatus.AVAILABLE))
                .availableBelts(beltRepository.countByStatus(BaggageBelt.BeltStatus.AVAILABLE))
                .totalStaff(staffRepository.count())
                .recentFlights(recent)
                .build();
    }
}
