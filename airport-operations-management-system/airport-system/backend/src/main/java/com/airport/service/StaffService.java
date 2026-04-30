package com.airport.service;

import com.airport.dto.StaffCreateRequest;
import com.airport.dto.StaffDTO;
import com.airport.entity.AirHostess;
import com.airport.entity.GroundStaff;
import com.airport.entity.Pilot;
import com.airport.entity.Staff;
import com.airport.repository.StaffRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StaffService {

    private final StaffRepository staffRepository;

    @Transactional(readOnly = true)
    public List<StaffDTO> getAll() {
        return staffRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StaffDTO getById(Long id) {
        return toDTO(findOrThrow(id));
    }

    public StaffDTO create(StaffCreateRequest req) {
        Staff staff = buildStaff(req);
        return toDTO(staffRepository.save(staff));
    }

    public StaffDTO update(Long id, StaffCreateRequest req) {
        Staff existing = findOrThrow(id);
        existing.setName(req.getName());
        existing.setPhone(req.getPhone());
        applySubclassFields(existing, req);
        return toDTO(staffRepository.save(existing));
    }

    public void delete(Long id) { staffRepository.deleteById(id); }

    private Staff buildStaff(StaffCreateRequest req) {
        return switch (req.getDtype()) {
            case "Pilot" -> {
                Pilot p = new Pilot();
                applyBase(p, req);
                p.setLicenseNumber(req.getLicenseNumber());
                p.setFlightHours(req.getFlightHours() != null ? req.getFlightHours() : 0);
                yield p;
            }
            case "GroundStaff" -> {
                GroundStaff gs = new GroundStaff();
                applyBase(gs, req);
                gs.setAreaAssigned(req.getAreaAssigned());
                yield gs;
            }
            case "AirHostess" -> {
                AirHostess ah = new AirHostess();
                applyBase(ah, req);
                ah.setLanguageSkills(req.getLanguageSkills());
                yield ah;
            }
            default -> throw new IllegalArgumentException("Unknown staff type: " + req.getDtype());
        };
    }

    private void applyBase(Staff s, StaffCreateRequest req) {
        s.setName(req.getName());
        s.setEmployeeId(req.getEmployeeId());
        s.setEmail(req.getEmail());
        s.setPhone(req.getPhone());
        s.setStatus(Staff.StaffStatus.ACTIVE);
    }

    private void applySubclassFields(Staff s, StaffCreateRequest req) {
        if (s instanceof Pilot p && req.getLicenseNumber() != null) p.setLicenseNumber(req.getLicenseNumber());
        if (s instanceof GroundStaff gs && req.getAreaAssigned() != null) gs.setAreaAssigned(req.getAreaAssigned());
        if (s instanceof AirHostess ah && req.getLanguageSkills() != null) ah.setLanguageSkills(req.getLanguageSkills());
    }

    private StaffDTO toDTO(Staff s) {
        StaffDTO.StaffDTOBuilder b = StaffDTO.builder()
                .id(s.getId()).dtype(s.getClass().getSimpleName())
                .name(s.getName()).employeeId(s.getEmployeeId())
                .email(s.getEmail()).phone(s.getPhone())
                .status(s.getStatus().name()).staffType(s.getStaffType());
        if (s instanceof Pilot p)       { b.licenseNumber(p.getLicenseNumber()); b.flightHours(p.getFlightHours()); }
        if (s instanceof GroundStaff gs) b.areaAssigned(gs.getAreaAssigned());
        if (s instanceof AirHostess ah)  b.languageSkills(ah.getLanguageSkills());
        return b.build();
    }

    private Staff findOrThrow(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Staff not found: " + id));
    }
}
