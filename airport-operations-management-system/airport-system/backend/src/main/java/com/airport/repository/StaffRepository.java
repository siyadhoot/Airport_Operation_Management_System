package com.airport.repository;

import com.airport.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByEmployeeId(String employeeId);
    Optional<Staff> findByEmail(String email);
    List<Staff> findByStatus(Staff.StaffStatus status);

    @Query("SELECT s FROM Staff s WHERE TYPE(s) = :type")
    List<Staff> findByType(@Param("type") Class<?> type);
}
