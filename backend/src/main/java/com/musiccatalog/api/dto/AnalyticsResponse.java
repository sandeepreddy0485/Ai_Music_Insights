package com.musiccatalog.api.dto;

import java.util.Map;

public class AnalyticsResponse {
    private int totalAlbums;
    private double averageRating;
    private int totalTracks;
    private Map<String, Long> genreDistribution;
    private Map<String, Long> artistDistribution;
    private Map<String, Long> releaseYearDistribution;
    private Map<String, Long> ratingDistribution;
    private double diversityScore;
    private double reviewRate;

    public AnalyticsResponse() {
    }

    public AnalyticsResponse(int totalAlbums, double averageRating, int totalTracks,
            double diversityScore, double reviewRate,
            Map<String, Long> genreDistribution, Map<String, Long> artistDistribution,
            Map<String, Long> releaseYearDistribution, Map<String, Long> ratingDistribution) {
        this.totalAlbums = totalAlbums;
        this.averageRating = averageRating;
        this.totalTracks = totalTracks;
        this.diversityScore = diversityScore;
        this.reviewRate = reviewRate;
        this.genreDistribution = genreDistribution;
        this.artistDistribution = artistDistribution;
        this.releaseYearDistribution = releaseYearDistribution;
        this.ratingDistribution = ratingDistribution;
    }

    public int getTotalAlbums() {
        return totalAlbums;
    }

    public void setTotalAlbums(int totalAlbums) {
        this.totalAlbums = totalAlbums;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public int getTotalTracks() {
        return totalTracks;
    }

    public void setTotalTracks(int totalTracks) {
        this.totalTracks = totalTracks;
    }

    public Map<String, Long> getGenreDistribution() {
        return genreDistribution;
    }

    public void setGenreDistribution(Map<String, Long> genreDistribution) {
        this.genreDistribution = genreDistribution;
    }

    public Map<String, Long> getArtistDistribution() {
        return artistDistribution;
    }

    public void setArtistDistribution(Map<String, Long> artistDistribution) {
        this.artistDistribution = artistDistribution;
    }

    public Map<String, Long> getReleaseYearDistribution() {
        return releaseYearDistribution;
    }

    public void setReleaseYearDistribution(Map<String, Long> releaseYearDistribution) {
        this.releaseYearDistribution = releaseYearDistribution;
    }

    public Map<String, Long> getRatingDistribution() {
        return ratingDistribution;
    }

    public void setRatingDistribution(Map<String, Long> ratingDistribution) {
        this.ratingDistribution = ratingDistribution;
    }

    public double getDiversityScore() {
        return diversityScore;
    }

    public void setDiversityScore(double diversityScore) {
        this.diversityScore = diversityScore;
    }

    public double getReviewRate() {
        return reviewRate;
    }

    public void setReviewRate(double reviewRate) {
        this.reviewRate = reviewRate;
    }
}
