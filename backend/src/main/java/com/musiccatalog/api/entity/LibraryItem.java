package com.musiccatalog.api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "library", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "apple_catalog_id"})
})
public class LibraryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "apple_catalog_id", nullable = false)
    private Long appleCatalogId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "artist_name", nullable = false, length = 255)
    private String artistName;

    @Column(length = 100)
    private String genre;

    @Column(name = "release_date", length = 50)
    private String releaseDate;

    @Column(name = "track_count")
    private Integer trackCount;

    @Column(name = "artwork_url", columnDefinition = "TEXT")
    private String artworkUrl;

    @Column(name = "user_rating")
    private Double userRating;

    @Column(name = "user_notes", columnDefinition = "TEXT")
    private String userNotes;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public LibraryItem() {}

    public LibraryItem(Long id, Long appleCatalogId, String title, String artistName, String genre,
                       String releaseDate, Integer trackCount, String artworkUrl, Double userRating,
                       String userNotes, User user, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.appleCatalogId = appleCatalogId;
        this.title = title;
        this.artistName = artistName;
        this.genre = genre;
        this.releaseDate = releaseDate;
        this.trackCount = trackCount;
        this.artworkUrl = artworkUrl;
        this.userRating = userRating;
        this.userNotes = userNotes;
        this.user = user;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
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

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
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
        private User user;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder appleCatalogId(Long appleCatalogId) { this.appleCatalogId = appleCatalogId; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder artistName(String artistName) { this.artistName = artistName; return this; }
        public Builder genre(String genre) { this.genre = genre; return this; }
        public Builder releaseDate(String releaseDate) { this.releaseDate = releaseDate; return this; }
        public Builder trackCount(Integer trackCount) { this.trackCount = trackCount; return this; }
        public Builder artworkUrl(String artworkUrl) { this.artworkUrl = artworkUrl; return this; }
        public Builder userRating(Double userRating) { this.userRating = userRating; return this; }
        public Builder userNotes(String userNotes) { this.userNotes = userNotes; return this; }
        public Builder user(User user) { this.user = user; return this; }

        public LibraryItem build() {
            return new LibraryItem(id, appleCatalogId, title, artistName, genre, releaseDate, trackCount, artworkUrl, userRating, userNotes, user, null, null);
        }
    }
}
