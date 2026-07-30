package com.musiccatalog.api.dto;

public class AiSummaryResponse {
    private String summary;
    private String topGenre;
    private String topArtist;
    private String dominantEra;
    private double averageRating;
    private int totalAlbums;

    public AiSummaryResponse() {}

    public AiSummaryResponse(String summary, String topGenre, String topArtist,
                             String dominantEra, double averageRating, int totalAlbums) {
        this.summary = summary;
        this.topGenre = topGenre;
        this.topArtist = topArtist;
        this.dominantEra = dominantEra;
        this.averageRating = averageRating;
        this.totalAlbums = totalAlbums;
    }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getTopGenre() { return topGenre; }
    public void setTopGenre(String topGenre) { this.topGenre = topGenre; }

    public String getTopArtist() { return topArtist; }
    public void setTopArtist(String topArtist) { this.topArtist = topArtist; }

    public String getDominantEra() { return dominantEra; }
    public void setDominantEra(String dominantEra) { this.dominantEra = dominantEra; }

    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }

    public int getTotalAlbums() { return totalAlbums; }
    public void setTotalAlbums(int totalAlbums) { this.totalAlbums = totalAlbums; }
}
