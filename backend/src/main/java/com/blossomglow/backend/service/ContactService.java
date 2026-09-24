package com.blossomglow.backend.service;

import com.blossomglow.backend.dto.ContactRequest;
import com.blossomglow.backend.entity.ContactMessage;
import com.blossomglow.backend.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    @Transactional
    public ContactMessage saveMessage(ContactRequest request) {
        ContactMessage message = ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .subject(request.getSubject())
                .message(request.getMessage())
                .build();
        return contactMessageRepository.save(message);
    }

    @Transactional(readOnly = true)
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc();
    }
}
