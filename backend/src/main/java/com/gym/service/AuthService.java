package com.gym.service;

import com.gym.config.JwtUtils;
import com.gym.dto.AuthRequest;
import com.gym.dto.AuthResponse;
import com.gym.entity.Admin;
import com.gym.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse authenticate(AuthRequest request) {
        String identifier = request.getUsername().trim();
        Optional<Admin> adminOpt = adminRepository.findByUsername(identifier);
        if (adminOpt.isEmpty()) {
            adminOpt = adminRepository.findByEmail(identifier);
        }

        if (adminOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        Admin admin = adminOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        String token = jwtUtils.generateToken(admin.getUsername());

        return new AuthResponse(
                token,
                admin.getId(),
                admin.getUsername(),
                admin.getEmail(),
                admin.getFullName(),
                admin.getRole()
        );
    }
}
