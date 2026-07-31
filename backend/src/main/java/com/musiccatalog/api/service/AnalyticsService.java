package com.musiccatalog.api.service;

import com.musiccatalog.api.dto.AnalyticsResponse;
import com.musiccatalog.api.entity.LibraryItem;
import com.musiccatalog.api.entity.User;
import com.musiccatalog.api.exception.ResourceNotFoundException;
import com.musiccatalog.api.repository.LibraryRepository;
import com.musiccatalog.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

        private final LibraryRepository libraryRepository;
        private final UserRepository userRepository;

        public AnalyticsService(LibraryRepository libraryRepository, UserRepository userRepository) {
                this.libraryRepository = libraryRepository;
                this.userRepository = userRepository;
        }

        @Transactional(readOnly = true)
        public AnalyticsResponse getUserAnalytics(String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new ResourceNotFoundException("User account not found"));

                List<LibraryItem> items = libraryRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

                if (items.isEmpty()) {
                        return new AnalyticsResponse(0, 0.0, 0, 0.0, 0.0,
                                        Collections.emptyMap(), Collections.emptyMap(),
                                        Collections.emptyMap(), Collections.emptyMap());
                }

                int totalAlbums = items.size();

                int totalTracks = items.stream()
                                .mapToInt(item -> item.getTrackCount() != null ? item.getTrackCount() : 0)
                                .sum();

                double avgRatingRaw = items.stream()
                                .filter(item -> item.getUserRating() != null && item.getUserRating() > 0)
                                .mapToDouble(LibraryItem::getUserRating)
                                .average()
                                .orElse(0.0);

                double averageRating = BigDecimal.valueOf(avgRatingRaw)
                                .setScale(1, RoundingMode.HALF_UP)
                                .doubleValue();

                // 1. Genre Distribution
                Map<String, Long> genreDistribution = items.stream()
                                .collect(Collectors.groupingBy(
                                                item -> (item.getGenre() != null && !item.getGenre().isBlank())
                                                                ? item.getGenre()
                                                                : "Unspecified",
                                                LinkedHashMap::new,
                                                Collectors.counting()));

                // 2. Artist Distribution
                Map<String, Long> artistDistribution = items.stream()
                                .collect(Collectors.groupingBy(
                                                LibraryItem::getArtistName,
                                                LinkedHashMap::new,
                                                Collectors.counting()));

                // 3. Release Year Distribution
                Map<String, Long> releaseYearDistribution = items.stream()
                                .map(item -> extractYear(item.getReleaseDate()))
                                .collect(Collectors.groupingBy(
                                                year -> year,
                                                TreeMap::new, // Sorted by year ascending
                                                Collectors.counting()));

                // 4. Rating Distribution (1 Star, 2 Stars, 3 Stars, 4 Stars, 5 Stars, Unrated)
                Map<String, Long> ratingDistribution = new LinkedHashMap<>();
                ratingDistribution.put("5 Stars", 0L);
                ratingDistribution.put("4 Stars", 0L);
                ratingDistribution.put("3 Stars", 0L);
                ratingDistribution.put("2 Stars", 0L);
                ratingDistribution.put("1 Star", 0L);
                ratingDistribution.put("Unrated", 0L);

                for (LibraryItem item : items) {
                        if (item.getUserRating() == null || item.getUserRating() <= 0) {
                                ratingDistribution.put("Unrated", ratingDistribution.get("Unrated") + 1);
                        } else {
                                int star = (int) Math.round(item.getUserRating());
                                String key = star == 1 ? "1 Star" : star + " Stars";
                                ratingDistribution.put(key, ratingDistribution.getOrDefault(key, 0L) + 1);
                        }
                }

                // 5. Advanced Mathematical Metrics
                long ratedAlbums = items.stream()
                                .filter(item -> item.getUserRating() != null && item.getUserRating() > 0).count();
                double reviewRateRaw = totalAlbums > 0 ? ((double) ratedAlbums / totalAlbums) * 100 : 0.0;
                double reviewRate = BigDecimal.valueOf(reviewRateRaw).setScale(1, RoundingMode.HALF_UP).doubleValue();

                double diversityScore = 0.0;
                if (!genreDistribution.isEmpty() && totalAlbums > 0) {
                        double entropy = 0.0;
                        for (Long count : genreDistribution.values()) {
                                double p = (double) count / totalAlbums;
                                entropy -= p * (Math.log(p) / Math.log(2));
                        }
                        double maxEntropy = Math.log(Math.max(2, genreDistribution.size())) / Math.log(2);
                        double rawScore = maxEntropy > 0 ? entropy / maxEntropy : 0.0;
                        diversityScore = BigDecimal.valueOf(rawScore).setScale(2, RoundingMode.HALF_UP).doubleValue();
                }

                return new AnalyticsResponse(
                                totalAlbums,
                                averageRating,
                                totalTracks,
                                diversityScore,
                                reviewRate,
                                genreDistribution,
                                artistDistribution,
                                releaseYearDistribution,
                                ratingDistribution);
        }

        private String extractYear(String releaseDate) {
                if (releaseDate == null || releaseDate.isBlank()) {
                        return "Unknown";
                }
                // Handle ISO formatted dates like "2008-06-12T07:00:00Z" or "2008"
                if (releaseDate.length() >= 4 && releaseDate.substring(0, 4).matches("\\d{4}")) {
                        return releaseDate.substring(0, 4);
                }
                return "Unknown";
        }
}
