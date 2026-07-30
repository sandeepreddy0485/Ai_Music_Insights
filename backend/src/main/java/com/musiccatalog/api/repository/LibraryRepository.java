package com.musiccatalog.api.repository;

import com.musiccatalog.api.entity.LibraryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LibraryRepository extends JpaRepository<LibraryItem, Long> {
    List<LibraryItem> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<LibraryItem> findByIdAndUserId(Long id, Long userId);
    boolean existsByUserIdAndAppleCatalogId(Long userId, Long appleCatalogId);
}
