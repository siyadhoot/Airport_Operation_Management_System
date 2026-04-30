package com.airport.config;

import com.airport.dto.FlightDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * FlightStatusPublisher — broadcasts live flight status updates to all subscribers.
 * <p>
 * In production, this would be triggered by actual flight status change events.
 * For demo purposes, a scheduled task simulates periodic updates.
 */
@Controller
@RequiredArgsConstructor
@Slf4j
@EnableScheduling
public class FlightStatusPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Handles client-sent ping messages on /app/flight-ping.
     * Echoes back a server timestamp.
     */
    @MessageMapping("/flight-ping")
    @SendTo("/topic/flight-status")
    public Map<String, Object> handlePing(Map<String, Object> payload) {
        log.debug("Received flight ping: {}", payload);
        return Map.of(
                "type", "PONG",
                "serverTime", LocalDateTime.now().toString(),
                "message", "Connected to flight status feed"
        );
    }

    /**
     * Called by FlightService when a flight's status changes.
     * Pushes the updated flight to all listening frontend clients.
     */
    public void broadcastFlightUpdate(FlightDTO flightDTO) {
        Map<String, Object> update = Map.of(
                "type", "FLIGHT_UPDATE",
                "flight", flightDTO,
                "timestamp", LocalDateTime.now().toString()
        );
        messagingTemplate.convertAndSend("/topic/flight-status", update);
        log.info("Broadcasted flight update for: {}", flightDTO.getFlightNumber());
    }
}
