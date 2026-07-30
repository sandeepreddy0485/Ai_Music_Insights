package com.musiccatalog.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AlbumSearchResultDto {

    @JsonProperty("collectionId")
    private Long appleCatalogId;

    @JsonProperty("collectionName")
    private String title;

    @JsonProperty("artistName")
    private String artistName;

    @JsonProperty("primaryGenreName")
    private String genre;

    @JsonProperty("releaseDate")
    private String releaseDate;

    @JsonProperty("trackCount")
    private Integer trackCount;

    @JsonProperty("artworkUrl100")
    private String artworkUrl;

    public AlbumSearchResultDto() {}

    public AlbumSearchResultDto(Long appleCatalogId, String title, String artistName, String genre,
                                String releaseDate, Integer trackCount, String artworkUrl) {
        this.appleCatalogId = appleCatalogId;
        this.title = title;
        this.artistName = artistName;
        this.genre = genre;
        this.releaseDate = releaseDate;
        this.trackCount = trackCount;
        this.artworkUrl = artworkUrl;
    }

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

    public String getArtworkUrl() {
        if (artworkUrl == null || artworkUrl.isBlank()) {
            return "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80";
        }
        return artworkUrl.replace("http://", "https://");
    }
    
    public void setArtworkUrl(String artworkUrl) { this.artworkUrl = artworkUrl; }
}
