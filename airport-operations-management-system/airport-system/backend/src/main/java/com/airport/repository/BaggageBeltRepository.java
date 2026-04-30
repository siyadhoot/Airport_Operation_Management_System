package com.airport.repository;

import com.airport.entity.BaggageBelt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BaggageBeltRepository extends JpaRepository<BaggageBelt, Long> {
    Optional<BaggageBelt> findByBeltCode(String beltCode);
    List<BaggageBelt> findByStatus(BaggageBelt.BeltStatus status);
    List<BaggageBelt> findByTerminal(String terminal);
    long countByStatus(BaggageBelt.BeltStatus status);
}
