package com.musiccatalog.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class UpdateLibraryItemRequest {

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Double userRating;

    private String userNotes;

    public UpdateLibraryItemRequest() {}

    public UpdateLibraryItemRequest(Double userRating, String userNotes) {
        this.userRating = userRating;
        this.userNotes = userNotes;
    }

    public Double getUserRating() { return userRating; }
    public void setUserRating(Double userRating) { this.userRating = userRating; }

    public String getUserNotes() { return userNotes; }
    public void setUserNotes(String userNotes) { this.userNotes = userNotes; }
}
