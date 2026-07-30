package com.musiccatalog.api.controller;

import com.musiccatalog.api.dto.AnalyticsResponse;
import com.musiccatalog.api.security.UserPrincipal;
import com.musiccatalog.api.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public ResponseEntity<AnalyticsResponse> getAnalytics(@AuthenticationPrincipal UserPrincipal principal) {
        AnalyticsResponse analytics = analyticsService.getUserAnalytics(principal.getUsername());
        return ResponseEntity.ok(analytics);
    }
}
