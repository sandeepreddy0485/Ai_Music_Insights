package com.musiccatalog.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ITunesSearchResponseDto {

    private int resultCount;
    private List<AlbumSearchResultDto> results = new ArrayList<>();

    public ITunesSearchResponseDto() {}

    public ITunesSearchResponseDto(int resultCount, List<AlbumSearchResultDto> results) {
        this.resultCount = resultCount;
        this.results = results;
    }

    public int getResultCount() { return resultCount; }
    public void setResultCount(int resultCount) { this.resultCount = resultCount; }

    public List<AlbumSearchResultDto> getResults() { return results; }
    public void setResults(List<AlbumSearchResultDto> results) { this.results = results; }
}
