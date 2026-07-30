package com.musiccatalog.api.service;

import com.musiccatalog.api.dto.AiSummaryResponse;
import com.musiccatalog.api.dto.AnalyticsResponse;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AiSummaryService {

    private final AnalyticsService analyticsService;

    public AiSummaryService(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    public AiSummaryResponse generateSummary(String userEmail) {
        AnalyticsResponse analytics = analyticsService.getUserAnalytics(userEmail);

        if (analytics.getTotalAlbums() == 0) {
            return new AiSummaryResponse(
                    "Your music library is currently empty! Search Apple's iTunes catalog and save your favorite albums to generate personalized AI insights.",
                    "None", "None", "N/A", 0.0, 0
            );
        }

        // Top Genre calculation
        Map.Entry<String, Long> topGenreEntry = analytics.getGenreDistribution().entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);
        String topGenre = topGenreEntry != null ? topGenreEntry.getKey() : "Various";

        // Top Artist calculation
        Map.Entry<String, Long> topArtistEntry = analytics.getArtistDistribution().entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);
        String topArtist = topArtistEntry != null ? topArtistEntry.getKey() : "Various Artists";
        long topArtistCount = topArtistEntry != null ? topArtistEntry.getValue() : 0;

        // Dominant Era calculation
        List<String> validYears = analytics.getReleaseYearDistribution().keySet().stream()
                .filter(year -> year.matches("\\d{4}"))
                .sorted()
                .collect(Collectors.toList());

        String dominantEra;
        if (validYears.isEmpty()) {
            dominantEra = "Various Eras";
        } else if (validYears.size() == 1) {
            dominantEra = validYears.get(0);
        } else {
            dominantEra = validYears.get(0) + " – " + validYears.get(validYears.size() - 1);
        }

        // Construct narrative summary
        StringBuilder sb = new StringBuilder();
        sb.append("Your library mainly consists of ").append(topGenre).append(" albums");

        if (topGenreEntry != null && analytics.getTotalAlbums() > 0) {
            int percentage = (int) Math.round((double) topGenreEntry.getValue() / analytics.getTotalAlbums() * 100);
            sb.append(" (").append(percentage).append("% of collection)");
        }
        sb.append(". ");

        if (!validYears.isEmpty()) {
            sb.append("Most albums in your catalog were released between ").append(dominantEra).append(". ");
        }

        if (topArtistCount > 1) {
            sb.append(topArtist).append(" is your most collected artist with ").append(topArtistCount).append(" saved albums. ");
        } else if (topArtistEntry != null) {
            sb.append(topArtist).append(" is featured in your saved collection. ");
        }

        if (analytics.getAverageRating() > 0) {
            sb.append("Your overall average rating across your collection is ").append(analytics.getAverageRating()).append(" / 5.0 stars.");
        } else {
            sb.append("You have ").append(analytics.getTotalAlbums()).append(" saved album(s) ready for review and rating.");
        }

        return new AiSummaryResponse(
                sb.toString(),
                topGenre,
                topArtist,
                dominantEra,
                analytics.getAverageRating(),
                analytics.getTotalAlbums()
        );
    }
}
