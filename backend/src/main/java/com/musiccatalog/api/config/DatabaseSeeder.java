package com.musiccatalog.api.config;

import com.musiccatalog.api.entity.LibraryItem;
import com.musiccatalog.api.entity.User;
import com.musiccatalog.api.repository.LibraryRepository;
import com.musiccatalog.api.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final UserRepository userRepository;
    private final LibraryRepository libraryRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, LibraryRepository libraryRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.libraryRepository = libraryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            logger.info("Database already initialized with users. Skipping seeding.");
            return;
        }

        logger.info("Seeding database with default user 'sandeep@example.com' and authentic catalog albums...");

        // 1. Create Default Demo User
        User user = User.builder()
                .name("Sandeep Reddy")
                .email("sandeep@example.com")
                .password(passwordEncoder.encode("password123"))
                .build();

        User savedUser = userRepository.save(user);

        // 2. Seed 8 Authentic Real-World Albums with Real HD Artwork, Ratings & Review Notes
        LibraryItem album1 = LibraryItem.builder()
                .appleCatalogId(1053933926L)
                .title("A Head Full of Dreams")
                .artistName("Coldplay")
                .genre("Alternative Rock")
                .releaseDate("2015-12-04")
                .trackCount(11)
                .artworkUrl("https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/3d/bf/96/3dbf9693-01c0-aa95-f1bf-4b9b6574bf18/825646982646.jpg/600x600bb.jpg")
                .userRating(5.0)
                .userNotes("Iconic album featuring 'Adventure of a Lifetime' and 'Hymn for the Weekend'. Vibrant production!")
                .user(savedUser)
                .build();

        LibraryItem album2 = LibraryItem.builder()
                .appleCatalogId(1122775993L)
                .title("Parachutes")
                .artistName("Coldplay")
                .genre("Alternative Rock")
                .releaseDate("2000-07-10")
                .trackCount(10)
                .artworkUrl("https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/ee/18/d8/ee18d84a-950c-e2f9-7153-6178ef793b8d/825646197361.jpg/600x600bb.jpg")
                .userRating(4.8)
                .userNotes("Coldplay's legendary debut album. 'Yellow' and 'Trouble' are timeless masterpieces.")
                .user(savedUser)
                .build();

        LibraryItem album3 = LibraryItem.builder()
                .appleCatalogId(1708308989L)
                .title("1989 (Taylor's Version)")
                .artistName("Taylor Swift")
                .genre("Pop")
                .releaseDate("2023-10-27")
                .trackCount(21)
                .artworkUrl("https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/44/14/03/441403eb-7b78-433b-821f-8e2b85e05a81/23UMGIM99285.rgb.jpg/600x600bb.jpg")
                .userRating(5.0)
                .userNotes("Incredible pop re-recording with phenomenal vault tracks like 'Is It Over Now?'.")
                .user(savedUser)
                .build();

        LibraryItem album4 = LibraryItem.builder()
                .appleCatalogId(1193700387L)
                .title("÷ (Divide)")
                .artistName("Ed Sheeran")
                .genre("Pop")
                .releaseDate("2017-03-03")
                .trackCount(16)
                .artworkUrl("https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f5/8d/ef/f58defb4-7b4c-9f8d-7360-7bc6bc9a806c/190295859039.jpg/600x600bb.jpg")
                .userRating(4.5)
                .userNotes("Global smash hit album featuring 'Shape of You' and 'Perfect'. Great acoustic pop production.")
                .user(savedUser)
                .build();

        LibraryItem album5 = LibraryItem.builder()
                .appleCatalogId(1441164426L)
                .title("Abbey Road")
                .artistName("The Beatles")
                .genre("Rock")
                .releaseDate("1969-09-26")
                .trackCount(17)
                .artworkUrl("https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a4/bc/f8/a4bcf8c4-e5a0-d12c-0e27-7756e09e1e9e/00602508007447.rgb.jpg/600x600bb.jpg")
                .userRating(5.0)
                .userNotes("The peak of rock history. 'Here Comes the Sun' and 'Come Together' defined generations.")
                .user(savedUser)
                .build();

        LibraryItem album6 = LibraryItem.builder()
                .appleCatalogId(1065973699L)
                .title("The Dark Side of the Moon")
                .artistName("Pink Floyd")
                .genre("Rock")
                .releaseDate("1973-03-01")
                .trackCount(10)
                .artworkUrl("https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/71/e6/55/71e655c6-f283-8a39-0128-44473e659424/886445778848.jpg/600x600bb.jpg")
                .userRating(4.9)
                .userNotes("Benchmark progressive rock album. Incredible sound design and atmospheric synth work.")
                .user(savedUser)
                .build();

        LibraryItem album7 = LibraryItem.builder()
                .appleCatalogId(269572838L)
                .title("Thriller")
                .artistName("Michael Jackson")
                .genre("Pop")
                .releaseDate("1982-11-30")
                .trackCount(9)
                .artworkUrl("https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/91/97/81/9197813a-a1b9-3837-1282-35804369e984/886443657381.jpg/600x600bb.jpg")
                .userRating(5.0)
                .userNotes("The best-selling album in music history. Unmatched rhythm, vocals, and production.")
                .user(savedUser)
                .build();

        LibraryItem album8 = LibraryItem.builder()
                .appleCatalogId(617154241L)
                .title("Random Access Memories")
                .artistName("Daft Punk")
                .genre("Electronic")
                .releaseDate("2013-05-17")
                .trackCount(13)
                .artworkUrl("https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/80/e7/1e/80e71e72-6a6d-e4d0-425f-2c09eb2c525f/886443927088.jpg/600x600bb.jpg")
                .userRating(4.8)
                .userNotes("Grammy-winning electronic masterpiece featuring 'Get Lucky' and 'Instant Crush'.")
                .user(savedUser)
                .build();

        libraryRepository.saveAll(Arrays.asList(
                album1, album2, album3, album4, album5, album6, album7, album8
        ));

        logger.info("Successfully seeded 8 authentic albums into default user library.");
    }
}
