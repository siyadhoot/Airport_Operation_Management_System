package com.airport.config;

import com.airport.repository.UserRepository;
import com.airport.security.JwtAuthFilter;
import com.airport.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * SecurityConfig — Spring Security configuration.
 *
 * Role-based access:
 *   ADMIN → full access (GET + POST + PUT + DELETE)
 *   STAFF → read-only + limited write operations
 *   PUBLIC → /auth/**, /ws/**
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/auth/**", "/ws/**").permitAll()

                // Dashboard — both roles
                .requestMatchers(HttpMethod.GET, "/dashboard/**").hasAnyRole("ADMIN", "STAFF")

                // Flights — staff can read; admin can write
                .requestMatchers(HttpMethod.GET,    "/flights/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.POST,   "/flights/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/flights/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/flights/**").hasRole("ADMIN")

                // Aircraft
                .requestMatchers(HttpMethod.GET,    "/aircraft/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.POST,   "/aircraft/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/aircraft/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/aircraft/**").hasRole("ADMIN")

                // Staff — admin only for writes
                .requestMatchers(HttpMethod.GET,    "/staff/**").hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.POST,   "/staff/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/staff/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/staff/**").hasRole("ADMIN")

                // Resources (Gates, Runways, Belts)
                .requestMatchers(HttpMethod.GET, "/gates/**", "/runways/**", "/belts/**")
                    .hasAnyRole("ADMIN", "STAFF")
                .requestMatchers(HttpMethod.POST, "/gates/**", "/runways/**", "/belts/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/gates/**", "/runways/**", "/belts/**")
                    .hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/gates/**", "/runways/**", "/belts/**")
                    .hasRole("ADMIN")

                // Passengers & Bookings
                .requestMatchers(HttpMethod.GET, "/passengers/**", "/bookings/**")
                    .hasAnyRole("ADMIN", "STAFF")
                .requestMatchers("/passengers/**", "/bookings/**").hasRole("ADMIN")

                // Users — admin only
                .requestMatchers("/users/**").hasRole("ADMIN")

                // Reports
                .requestMatchers("/reports/**").hasAnyRole("ADMIN", "STAFF")

                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter(jwtService, userDetailsService());
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
