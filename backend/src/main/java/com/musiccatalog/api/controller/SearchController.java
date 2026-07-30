package com.musiccatalog.api.controller;

import com.musiccatalog.api.dto.AlbumSearchResultDto;
import com.musiccatalog.api.service.ITunesSearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SearchController {

    private final ITunesSearchService iTunesSearchService;

    public SearchController(ITunesSearchService iTunesSearchService) {
        this.iTunesSearchService = iTunesSearchService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<AlbumSearchResultDto>> searchAlbums(
            @RequestParam(name = "query") String query,
            @RequestParam(name = "type", defaultValue = "artist", required = false) String type) {
        List<AlbumSearchResultDto> results = iTunesSearchService.searchAlbums(query, type);
        return ResponseEntity.ok(results);
    }
}
