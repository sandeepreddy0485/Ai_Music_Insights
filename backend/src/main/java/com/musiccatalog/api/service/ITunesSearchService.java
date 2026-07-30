package com.musiccatalog.api.service;

import com.musiccatalog.api.dto.AlbumSearchResultDto;
import com.musiccatalog.api.dto.ITunesSearchResponseDto;
import com.musiccatalog.api.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ITunesSearchService {

    private static final Logger logger = LoggerFactory.getLogger(ITunesSearchService.class);

    private final RestTemplate restTemplate;

    @Value("${itunes.api.url:https://itunes.apple.com/search}")
    private String itunesApiUrl;

    public ITunesSearchService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<AlbumSearchResultDto> searchAlbums(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new BadRequestException("Search query term cannot be empty");
        }

        // Search iTunes API enforcing entity=album
        URI targetUri = UriComponentsBuilder.fromHttpUrl(itunesApiUrl)
                .queryParam("term", query.trim())
                .queryParam("entity", "album")
                .queryParam("limit", 25)
                .build()
                .toUri();

        logger.info("Calling upstream iTunes Search API: {}", targetUri);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<ITunesSearchResponseDto> responseEntity = restTemplate.exchange(
                    targetUri,
                    HttpMethod.GET,
                    requestEntity,
                    ITunesSearchResponseDto.class
            );

            ITunesSearchResponseDto response = responseEntity.getBody();
            if (response == null || response.getResults() == null) {
                logger.warn("iTunes API returned empty response body for query: {}", query);
                return Collections.emptyList();
            }

            logger.info("Successfully fetched {} album results for query '{}'", response.getResults().size(), query);

            // Filter to ensure valid catalog ID exists
            return response.getResults().stream()
                    .filter(album -> album.getAppleCatalogId() != null)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error communicating with iTunes API for URI '{}': {}", targetUri, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch album results from iTunes API: " + e.getMessage());
        }
    }
}
