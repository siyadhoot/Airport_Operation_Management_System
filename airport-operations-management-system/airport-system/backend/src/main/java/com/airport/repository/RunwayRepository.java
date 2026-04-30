package com.airport.repository;

import com.airport.entity.Runway;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RunwayRepository extends JpaRepository<Runway, Long> {
    Optional<Runway> findByRunwayCode(String runwayCode);
    List<Runway> findByStatus(Runway.RunwayStatus status);
    long countByStatus(Runway.RunwayStatus status);
}
