package com.musiccatalog.api.service;

import com.musiccatalog.api.dto.LibraryItemResponse;
import com.musiccatalog.api.dto.SaveAlbumRequest;
import com.musiccatalog.api.dto.UpdateLibraryItemRequest;
import com.musiccatalog.api.entity.LibraryItem;
import com.musiccatalog.api.entity.User;
import com.musiccatalog.api.exception.BadRequestException;
import com.musiccatalog.api.exception.ResourceNotFoundException;
import com.musiccatalog.api.repository.LibraryRepository;
import com.musiccatalog.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LibraryService {

    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;

    public LibraryService(LibraryRepository libraryRepository, UserRepository userRepository) {
        this.libraryRepository = libraryRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<LibraryItemResponse> getUserLibrary(String userEmail) {
        User user = getUserByEmail(userEmail);
        return libraryRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(LibraryItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public LibraryItemResponse saveAlbum(String userEmail, SaveAlbumRequest request) {
        User user = getUserByEmail(userEmail);

        if (libraryRepository.existsByUserIdAndAppleCatalogId(user.getId(), request.getAppleCatalogId())) {
            throw new BadRequestException("Album with catalog ID '" + request.getAppleCatalogId() + "' is already in your library");
        }

        LibraryItem item = LibraryItem.builder()
                .appleCatalogId(request.getAppleCatalogId())
                .title(request.getTitle())
                .artistName(request.getArtistName())
                .genre(request.getGenre() != null ? request.getGenre() : "Unspecified")
                .releaseDate(request.getReleaseDate())
                .trackCount(request.getTrackCount())
                .artworkUrl(request.getArtworkUrl())
                .userRating(request.getUserRating())
                .userNotes(request.getUserNotes())
                .user(user)
                .build();

        LibraryItem saved = libraryRepository.save(item);
        return LibraryItemResponse.fromEntity(saved);
    }

    @Transactional
    public LibraryItemResponse updateLibraryItem(String userEmail, Long id, UpdateLibraryItemRequest request) {
        User user = getUserByEmail(userEmail);
        LibraryItem item = libraryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Library item with ID " + id + " not found in your library"));

        if (request.getUserRating() != null) {
            item.setUserRating(request.getUserRating());
        }
        if (request.getUserNotes() != null) {
            item.setUserNotes(request.getUserNotes());
        }

        LibraryItem updated = libraryRepository.save(item);
        return LibraryItemResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteLibraryItem(String userEmail, Long id) {
        User user = getUserByEmail(userEmail);
        LibraryItem item = libraryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Library item with ID " + id + " not found in your library"));

        libraryRepository.delete(item);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User account not found"));
    }
}
