package com.musiccatalog.api.dto;

import com.musiccatalog.api.entity.LibraryItem;
import java.time.LocalDateTime;

public class LibraryItemResponse {
    private Long id;
    private Long appleCatalogId;
    private String title;
    private String artistName;
    private String genre;
    private String releaseDate;
    private Integer trackCount;
    private String artworkUrl;
    private Double userRating;
    private String userNotes;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LibraryItemResponse() {}

    public static LibraryItemResponse fromEntity(LibraryItem item) {
        if (item == null) return null;
        LibraryItemResponse response = new LibraryItemResponse();
        response.setId(item.getId());
        response.setAppleCatalogId(item.getAppleCatalogId());
        response.setTitle(item.getTitle());
        response.setArtistName(item.getArtistName());
        response.setGenre(item.getGenre());
        response.setReleaseDate(item.getReleaseDate());
        response.setTrackCount(item.getTrackCount());
        response.setArtworkUrl(item.getArtworkUrl());
        response.setUserRating(item.getUserRating());
        response.setUserNotes(item.getUserNotes());
        response.setUserId(item.getUser() != null ? item.getUser().getId() : null);
        response.setCreatedAt(item.getCreatedAt());
        response.setUpdatedAt(item.getUpdatedAt());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAppleCatalogId() { return appleCatalogId; }
    public void setAppleCatalogId(Long appleCatalogId) { this.appleCatalogId = appleCatalogId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getReleaseDate() { return releaseDate; }
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }

    public Integer getTrackCount() { return trackCount; }
    public void setTrackCount(Integer trackCount) { this.trackCount = trackCount; }

    public String getArtworkUrl() { return artworkUrl; }
    public void setArtworkUrl(String artworkUrl) { this.artworkUrl = artworkUrl; }

    public Double getUserRating() { return userRating; }
    public void setUserRating(Double userRating) { this.userRating = userRating; }

    public String getUserNotes() { return userNotes; }
    public void setUserNotes(String userNotes) { this.userNotes = userNotes; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
