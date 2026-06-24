# Database Schema Design - AI-Powered Smart Waste Mapping Platform

This document describes the database design, collection relationships, indexes, validation constraints, and includes the Entity Relationship (ER) Diagram.

## ER Diagram (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ WASTE_REPORTS : "reports"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ ACHIEVEMENTS : "unlocks"
    USERS ||--|| LEADERBOARD : "placed_in"
    
    USERS {
        ObjectId id PK
        String username
        String email UK
        String password
        String role
        Number impactScore
        Date createdAt
    }

    WASTE_REPORTS {
        ObjectId id PK
        Object location "GeoJSON Point (2dsphere)"
        String wasteType
        String description
        String status
        String photoUrl
        ObjectId userId FK
        String assignedTeam
        Date createdAt
    }

    NOTIFICATIONS {
        ObjectId id PK
        ObjectId userId FK "Nullable (Global if null)"
        String message
        Boolean read
        String type
        Date createdAt
    }

    ACHIEVEMENTS {
        ObjectId id PK
        ObjectId userId FK
        String title
        String description
        String badgeUrl
        Date createdAt
    }

    LEADERBOARD {
        ObjectId id PK
        ObjectId userId FK UK
        String username
        Number impactScore
        Number rank
        Date lastUpdated
    }
```

---

## Collections Details

### 1. Users
- **Purpose**: System credentials, authorization profiles, and gamified scores.
- **Indexes**:
  - `email` (Unique): For fast logins.
  - `impactScore` (-1): Descending lookup for ranking.
- **Validation Rules**:
  - `email`: Enforces regex email structure.
  - `password`: Must be at least 6 characters. Selected out of queries by default.
  - `role`: Constrained to enum values `['user', 'admin']`.

### 2. WasteReports
- **Purpose**: Tracks flagged trash piles, geo-hotspots, and cleanup resolution states.
- **Indexes**:
  - `location` (`2dsphere` index): Spatial index to locate nearby reports or query boundaries.
  - `status` (1): Speeds filter querying (e.g. pending vs resolved).
  - `userId` (1): Linking query optimization.
  - `createdAt` (-1): Descending timeline indexing.
- **Validation Rules**:
  - `location`: Requires standard GeoJSON validation format `Point` with `[longitude, latitude]` bounds.
  - `wasteType`: Enforces categorical enum: `['Plastic', 'Organic', 'E-waste', 'Metal', 'Glass', 'Hazardous', 'Other']`.

### 3. Notifications
- **Purpose**: Persistent client socket events log cache.
- **Indexes**:
  - `userId` (1)
  - `createdAt` (-1)

### 4. Achievements
- **Purpose**: Unlocked gaming achievements.
- **Indexes**:
  - `userId` (1)

### 5. Leaderboard
- **Purpose**: Caches active scoreboard standings to avoid dynamic aggregate heavy operations.
- **Indexes**:
  - `userId` (Unique, 1)
  - `rank` (1)
  - `impactScore` (-1)
