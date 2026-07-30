package com.musiccatalog.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AlbumSearchResultDto {

    private Long appleCatalogId;
    private String title;
    private String artistName;
    private String genre;
    private String releaseDate;
    private Integer trackCount;
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

    @JsonProperty("collectionId")
    public Long getAppleCatalogId() { return appleCatalogId; }
    
    @JsonProperty("collectionId")
    public void setAppleCatalogId(Long appleCatalogId) { this.appleCatalogId = appleCatalogId; }

    @JsonProperty("collectionName")
    public String getTitle() { return title; }
    
    @JsonProperty("collectionName")
    public void setTitle(String title) { this.title = title; }

    @JsonProperty("artistName")
    public String getArtistName() { return artistName; }
    
    @JsonProperty("artistName")
    public void setArtistName(String artistName) { this.artistName = artistName; }

    @JsonProperty("primaryGenreName")
    public String getGenre() { return genre; }
    
    @JsonProperty("primaryGenreName")
    public void setGenre(String genre) { this.genre = genre; }

    @JsonProperty("releaseDate")
    public String getReleaseDate() { return releaseDate; }
    
    @JsonProperty("releaseDate")
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }

    @JsonProperty("trackCount")
    public Integer getTrackCount() { return trackCount; }
    
    @JsonProperty("trackCount")
    public void setTrackCount(Integer trackCount) { this.trackCount = trackCount; }

    @JsonProperty("artworkUrl100")
    public String getArtworkUrl() {
        if (artworkUrl == null || artworkUrl.isBlank()) {
            return null;
        }
        return artworkUrl.replace("http://", "https://");
    }
    
    @JsonProperty("artworkUrl100")
    public void setArtworkUrl(String artworkUrl) { this.artworkUrl = artworkUrl; }
}
