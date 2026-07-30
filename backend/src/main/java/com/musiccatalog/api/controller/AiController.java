package com.musiccatalog.api.controller;

import com.musiccatalog.api.dto.AiSummaryResponse;
import com.musiccatalog.api.security.UserPrincipal;
import com.musiccatalog.api.service.AiSummaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiSummaryService aiSummaryService;

    public AiController(AiSummaryService aiSummaryService) {
        this.aiSummaryService = aiSummaryService;
    }

    @GetMapping("/summary")
    public ResponseEntity<AiSummaryResponse> getAiSummary(@AuthenticationPrincipal UserPrincipal principal) {
        AiSummaryResponse summary = aiSummaryService.generateSummary(principal.getUsername());
        return ResponseEntity.ok(summary);
    }
}
