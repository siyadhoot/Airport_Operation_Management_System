package com.airport.repository;

import com.airport.entity.Gate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GateRepository extends JpaRepository<Gate, Long> {
    Optional<Gate> findByGateCode(String gateCode);
    List<Gate> findByStatus(Gate.GateStatus status);
    List<Gate> findByTerminal(String terminal);
    long countByStatus(Gate.GateStatus status);
}
