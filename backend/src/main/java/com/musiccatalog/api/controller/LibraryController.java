package com.musiccatalog.api.controller;

import com.musiccatalog.api.dto.LibraryItemResponse;
import com.musiccatalog.api.dto.SaveAlbumRequest;
import com.musiccatalog.api.dto.UpdateLibraryItemRequest;
import com.musiccatalog.api.security.UserPrincipal;
import com.musiccatalog.api.service.LibraryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    private final LibraryService libraryService;

    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @GetMapping
    public ResponseEntity<List<LibraryItemResponse>> getUserLibrary(@AuthenticationPrincipal UserPrincipal principal) {
        List<LibraryItemResponse> library = libraryService.getUserLibrary(principal.getUsername());
        return ResponseEntity.ok(library);
    }

    @PostMapping
    public ResponseEntity<LibraryItemResponse> saveAlbum(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SaveAlbumRequest request) {
        LibraryItemResponse response = libraryService.saveAlbum(principal.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LibraryItemResponse> updateLibraryItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody UpdateLibraryItemRequest request) {
        LibraryItemResponse response = libraryService.updateLibraryItem(principal.getUsername(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLibraryItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        libraryService.deleteLibraryItem(principal.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
