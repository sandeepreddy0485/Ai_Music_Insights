# Music Catalog Insights Platform

![Music Insights Logo](logo.png)

🚀 **Live Production Application:** [https://ai-music-insights.vercel.app](https://ai-music-insights.vercel.app)

A production-quality, interview-ready full-stack web application for cataloging music albums, analyzing collection trends, and generating natural-language AI insights. Built with **Spring Boot 3.x**, **Spring Security**, **JWT Authentication**, **Spring Data JPA**, **PostgreSQL**, **iTunes Search API**, and a modern **React.js + Vite + Tailwind CSS + Recharts** frontend.

---

## Architecture Overview

```
                               ┌──────────────────────────────────────────────┐
                               │           React.js SPA (Vite)                │
                               │  - Tailwind CSS + Recharts                   │
                               │  - Axios with JWT Interceptors               │
                               └──────────────────────┬───────────────────────┘
                                                      │
                                                      │ HTTP REST APIs
                                                      ▼
 ┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
 │                                   Spring Boot 3.x Backend API                                     │
 │                                                                                                   │
 │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │
 │  │ AuthController  │    │ SearchController│    │LibraryController│    │ AnalyticsController    │  │
 │  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘    │ & AiController         │  │
 │           │                      │                      │             └───────────┬────────────┘  │
 │           ▼                      ▼                      ▼                         ▼               │
 │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │
 │  │   AuthService   │    │ITunesSearchSvc  │    │ LibraryService  │    │ AnalyticsService       │  │
 │  │   (BCrypt+JWT)  │    │ (RestTemplate)  │    │  (JPA CRUD)     │    │ & AiSummaryService     │  │
 │  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘    └───────────┬────────────┘  │
 └───────────┼──────────────────────┼──────────────────────┼─────────────────────────┼───────────────┘
             │                      │                      │                         │
             ▼                      ▼                      ▼                         │
   ┌──────────────────┐    ┌─────────────────┐    ┌─────────────────┐                │
   │  UserRepository  │    │ Apple iTunes    │    │LibraryRepository│ ───────────────┘
   └─────────┬────────┘    │  Search API     │    └────────┬────────┘
             │             └─────────────────┘             │
             ▼                                             ▼
 ┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
 │                                    PostgreSQL / H2 Database                                       │
 │  - users (id, name, email, password, created_at)                                                  │
 │  - library (id, apple_catalog_id, title, artist_name, genre, release_date, rating, notes, user_id)│
 └───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Backend
- **Java 17 / 21**
- **Spring Boot 3.3.5** (Web, Data JPA, Security, Validation)
- **Spring Security + JJWT 0.12.5** (Stateless Bearer Authentication)
- **BCrypt Password Hashing**
- **PostgreSQL** (Production DB) & **H2 Database** (Zero-config local dev profile)
- **Maven** & **Lombok**

### Frontend
- **React 18** (Vite build tool)
- **Tailwind CSS v4** (Dark mode glassmorphism UI)
- **Recharts** (Pie, Bar, Line, and Histogram charts)
- **Axios** (Centralized client with automatic JWT token injection)
- **React Router DOM v6** (Protected route guards)
- **Lucide React** (Modern iconography)

---

## Project Package Structure

```
backend/
└── src/main/java/com/musiccatalog/api/
    ├── config/          # SecurityConfig, AppConfig (RestTemplate, CORS)
    ├── controller/      # Health, Auth, Search, Library, Analytics, AI Controllers
    ├── dto/             # Request & Response Data Transfer Objects
    ├── entity/          # User and LibraryItem JPA Entities
    ├── exception/       # GlobalExceptionHandler (@ControllerAdvice) & ApiErrorResponse
    ├── repository/      # UserRepository, LibraryRepository
    ├── security/        # JwtUtils, JwtAuthenticationFilter, CustomUserDetailsService, UserPrincipal
    ├── service/         # AuthService, ITunesSearchService, LibraryService, AnalyticsService, AiSummaryService
    └── util/            # Helper utilities

frontend/
└── src/
    ├── components/      # Navbar, ProtectedRoute, RatingStars, SaveAlbumModal, EditLibraryModal
    ├── context/         # AuthContext (JWT session management)
    ├── hooks/           # useDebounce (live search optimization)
    ├── pages/           # LoginPage, RegisterPage, SearchPage, LibraryPage, DashboardPage
    └── services/        # api.js, authService, searchService, libraryService, analyticsService
```

---

## Database Schema

### `users` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INC | User identifier |
| `name` | VARCHAR(100) | NOT NULL | User full name |
| `email` | VARCHAR(150) | UNIQUE, NOT NULL | User email address |
| `password` | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| `created_at` | TIMESTAMP | NOT NULL | Registration timestamp |

### `library` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INC | Library item identifier |
| `apple_catalog_id`| BIGINT | NOT NULL | iTunes collectionId |
| `title` | VARCHAR(255) | NOT NULL | Album title |
| `artist_name` | VARCHAR(255) | NOT NULL | Artist name |
| `genre` | VARCHAR(100) | | Album genre |
| `release_date` | VARCHAR(50) | | Release date / year |
| `track_count` | INT | | Album track count |
| `artwork_url` | TEXT | | Cover image URL |
| `user_rating` | DOUBLE | 1.0 - 5.0 | User star rating |
| `user_notes` | TEXT | | Personal review notes |
| `user_id` | BIGINT | FOREIGN KEY (users.id) | Owner user ID |
| `created_at` | TIMESTAMP | NOT NULL | Saved timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | Last update timestamp |

---

## REST API Specification

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System status and active profile health check |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user and return JWT bearer token |
| `GET` | `/api/search` | Protected | Live search iTunes catalog (`?query=coldplay&type=album`) |
| `GET` | `/api/library` | Protected | Fetch authenticated user's saved album collection |
| `POST` | `/api/library` | Protected | Save album to user's library with rating/notes |
| `PUT` | `/api/library/{id}` | Protected | Update rating and personal notes of saved album |
| `DELETE`| `/api/library/{id}` | Protected | Remove album from user's library |
| `GET` | `/api/analytics` | Protected | Aggregated metrics for Recharts visualizations |
| `GET` | `/api/ai/summary` | Protected | Natural-language AI library taste summary |

---

## Local Setup & Running Instructions

### Prerequisites
- JDK 17 or higher
- Maven 3.8+
- Node.js 18+ and npm

### 1. Run Backend Server
```bash
# Navigate to backend directory
cd backend

# Build & run with dev profile (uses in-memory H2 database out of the box)
mvn spring-boot:run
```
*Backend runs on `http://localhost:8080`.*

### 2. Run Frontend Client
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## Deployment Guide

### Backend Deployment (Render or Railway)
1. Push your repository to GitHub.
2. Create a **PostgreSQL Database** on Render or Railway.
3. Deploy a new **Web Service** pointing to `./backend`.
4. Set Build Command: `mvn clean package -DskipTests`
5. Set Start Command: `java -jar target/music-catalog-api-0.0.1-SNAPSHOT.jar`
6. Configure Environment Variables:
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<HOST>:<PORT>/<DB_NAME>`
   - `SPRING_DATASOURCE_USERNAME`: `<DB_USER>`
   - `SPRING_DATASOURCE_PASSWORD`: `<DB_PASS>`
   - `JWT_SECRET`: `<YOUR_64_CHAR_SECRET_KEY>`

### Frontend Deployment (Vercel)
1. Import your GitHub repository into Vercel.
2. Select Root Directory: `./frontend`
3. Framework Preset: `Vite`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy! Vercel handles SPA client routing automatically.
