package com.blossomglow.backend.dto;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistSyncRequest {
    @Builder.Default
    private List<String> productIds = new ArrayList<>();
}
