package com.airport.service;

import com.airport.dto.AuthResponse;
import com.airport.dto.LoginRequest;
import com.airport.dto.RegisterRequest;
import com.airport.dto.UserDTO;
import com.airport.entity.User;
import com.airport.repository.UserRepository;
import com.airport.security.JwtService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

// ============================================================
//  AUTH SERVICE
// ============================================================
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    public AuthResponse login(LoginRequest req) {
        log.info("--- DEBUG LOGIN START ---");
        log.info("Received username: {}", req.getUsername());
        log.info("Received raw password: {}", req.getPassword());
        
        User userEntity = userRepository.findByUsername(req.getUsername()).orElse(null);
        if (userEntity != null) {
            log.info("Stored password hash: {}", userEntity.getPassword());
            boolean matches = passwordEncoder.matches(req.getPassword(), userEntity.getPassword());
            log.info("Result of passwordEncoder.matches(raw, hash): {}", matches);
            if (matches) {
                log.info("LOGIN SUCCESS");
            } else {
                log.info("LOGIN FAILED – PASSWORD MISMATCH");
            }
        } else {
            log.info("User not found in DB");
        }
        log.info("--- DEBUG LOGIN END ---");

        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole().name())
                .expiresIn(86400000L)
                .build();
    }

    public UserDTO register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername()))
            throw new IllegalArgumentException("Username already taken");
        User user = User.builder()
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .email(req.getEmail())
                .role(req.getRole() != null ? User.Role.valueOf(req.getRole()) : User.Role.STAFF)
                .build();
        user = userRepository.save(user);
        return new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name());
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserDTO(u.getId(), u.getUsername(), u.getEmail(), u.getRole().name()))
                .collect(Collectors.toList());
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
