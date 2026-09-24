package com.blossomglow.backend.controller;

import com.blossomglow.backend.dto.ContactRequest;
import com.blossomglow.backend.entity.ContactMessage;
import com.blossomglow.backend.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitContactMessage(@Valid @RequestBody ContactRequest request) {
        ContactMessage saved = contactService.saveMessage(request);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("messageId", saved.getId());
        response.put("note", "Thank you for reaching out to BlossomGlow! Our artisan team will reply within 24 hours.");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
