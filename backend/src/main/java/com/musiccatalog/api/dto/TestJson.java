package com.musiccatalog.api.dto;

import com.fasterxml.jackson.databind.ObjectMapper;

public class TestJson {
    public static void main(String[] args) {
        try {
            String json = "{ \"collectionId\": 10, \"collectionName\": \"Fear\", \"primaryGenreName\": \"Rock\", \"artworkUrl100\": \"http://example.com/cover.jpg\" }";
            ObjectMapper mapper = new ObjectMapper();
            AlbumSearchResultDto dto = mapper.readValue(json, AlbumSearchResultDto.class);

            System.out.println("ID: " + dto.getAppleCatalogId());
            System.out.println("Title: " + dto.getTitle());
            System.out.println("Genre: " + dto.getGenre());
            System.out.println("URL: " + dto.getArtworkUrl());

            String out = mapper.writeValueAsString(dto);
            System.out.println("Serialized: " + out);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
