package com.musiccatalog.api.service;

import com.musiccatalog.api.dto.AiSummaryResponse;
import com.musiccatalog.api.dto.AnalyticsResponse;
import org.springframework.stereotype.Service;

import java.util.Comparator;
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
                    "None", "None", "N/A", 0.0, 0);
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

        // Dominant Era calculation (Most Frequent Decade)
        Map.Entry<String, Long> dominantDecadeEntry = analytics.getReleaseYearDistribution().entrySet().stream()
                .filter(e -> e.getKey().matches("\\d{4}"))
                .collect(Collectors.groupingBy(
                        e -> e.getKey().substring(0, 3) + "0s",
                        Collectors.summingLong(Map.Entry::getValue)))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);

        String dominantEra = dominantDecadeEntry != null ? dominantDecadeEntry.getKey() : "Various Eras";

        // Construct narrative summary
        StringBuilder sb = new StringBuilder();
        sb.append("Your library mainly consists of ").append(topGenre).append(" albums");

        if (topGenreEntry != null && analytics.getTotalAlbums() > 0) {
            int percentage = (int) Math.round((double) topGenreEntry.getValue() / analytics.getTotalAlbums() * 100);
            sb.append(" (").append(percentage).append("% of collection)");
        }
        sb.append(". ");

        if (dominantDecadeEntry != null) {
            sb.append("A significant portion of your catalog belongs to the ").append(dominantEra).append(" era. ");
        }

        if (topArtistCount > 1) {
            sb.append(topArtist).append(" is your most collected artist with ").append(topArtistCount)
                    .append(" saved albums. ");
        } else if (topArtistEntry != null) {
            sb.append(topArtist).append(" is featured in your saved collection. ");
        }

        // Behavioral & Mastery Analytics
        if (analytics.getDiversityScore() >= 0.70) {
            sb.append("Your high genre entropy (").append(analytics.getDiversityScore()).append(
                    ") marks you as an Eclectic Sonic Explorer, covering a truly wide array of musical landscapes. ");
        } else if (analytics.getDiversityScore() >= 0.40) {
            sb.append("Your taste is balanced, weaving between a few core styles with occasional exploration. ");
        } else if (analytics.getTotalAlbums() > 3) {
            sb.append(
                    "You are a Focused Genre Loyalist, dedicating your listening heavily to your favorite signature sounds. ");
        }

        if (analytics.getReviewRate() >= 80) {
            sb.append("Impressively, you have cataloged and rated ").append((int) analytics.getReviewRate())
                    .append("% of your vast collection. ");
        } else if (analytics.getReviewRate() > 0) {
            sb.append("You've reviewed ").append((int) analytics.getReviewRate()).append("% of your library so far. ");
        }

        if (analytics.getAverageRating() > 0) {
            sb.append("Your overall average rating across your collection is ").append(analytics.getAverageRating())
                    .append(" / 5.0 stars.");
        } else {
            sb.append("You have ").append(analytics.getTotalAlbums())
                    .append(" saved album(s) ready for review and rating.");
        }

        return new AiSummaryResponse(
                sb.toString(),
                topGenre,
                topArtist,
                dominantEra,
                analytics.getAverageRating(),
                analytics.getTotalAlbums());
    }
}
