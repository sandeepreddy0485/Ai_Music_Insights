package com.musiccatalog.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AlbumSearchResultDto {

    @JsonProperty("collectionId")
    private Long appleCatalogId;

    @JsonProperty("collectionName")
    private String title;

    @JsonProperty("collectionCensoredName")
    private String collectionCensoredName;

    @JsonProperty("trackName")
    private String trackName;

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

    @JsonProperty("artworkUrl60")
    private String artworkUrl60;

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

    public String getTitle() {
        if (title != null && !title.isBlank()) {
            return title;
        }
        if (collectionCensoredName != null && !collectionCensoredName.isBlank()) {
            return collectionCensoredName;
        }
        if (trackName != null && !trackName.isBlank()) {
            return trackName;
        }
        if (artistName != null && !artistName.isBlank()) {
            return artistName + " - Greatest Hits";
        }
        return "Untitled Album";
    }

    public void setTitle(String title) { this.title = title; }

    public String getArtistName() { 
        return (artistName != null && !artistName.isBlank()) ? artistName : "Various Artists"; 
    }
    
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public String getGenre() { 
        return (genre != null && !genre.isBlank()) ? genre : "Music"; 
    }

    public void setGenre(String genre) { this.genre = genre; }

    public String getReleaseDate() { return releaseDate; }
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }

    public Integer getTrackCount() { return trackCount; }
    public void setTrackCount(Integer trackCount) { this.trackCount = trackCount; }

    public String getArtworkUrl() {
        String url = artworkUrl;
        if (url == null || url.isBlank()) {
            url = artworkUrl60;
        }
        if (url == null || url.isBlank()) {
            return "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80";
        }
        String secureUrl = url.replace("http://", "https://");
        return secureUrl.replace("100x100bb", "600x600bb");
    }
    
    public void setArtworkUrl(String artworkUrl) { this.artworkUrl = artworkUrl; }
}
