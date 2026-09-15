# Product Requirements Document (PRD): Blogging Platform

## 1. Overview
The Blogging Platform is a full-stack web application that allows users to create, share, and interact with blog posts containing text and multimedia (images and videos). The goal is to provide a seamless experience for content creators to publish their work and for readers to discover and engage with content through a like/dislike system.

## 2. Target Audience
- **Content Creators**: Individuals who want to share their thoughts, tutorials, or stories with multimedia support.
- **Readers**: Users interested in discovering new content and expressing their preference for posts.

## 3. Functional Requirements

### 3.1 User Authentication & Management
- **User Registration**: Users must be able to create an account using their email and password.
- **User Login**: Users must be able to authenticate via email and password to access private features.
- **User Logout**: Users must be able to securely log out of their session.
- **Profile Management**: Authenticated users should be able to retrieve their own account details.

### 3.2 Blog Management
- **Blog Creation**:
    - Authenticated users can create a new blog post.
    - Posts must support text content.
    - Posts must support multiple media attachments (up to 10 files).
    - Supported media types: Images and Videos.
    - Maximum file size: 10MB per file.
- **Blog Discovery**:
    - Users (public) can view a paginated list of all blog posts.
    - The system should support `page` and `limit` parameters for efficient loading.
- **Blog Detailed View**:
    - Users can view a single blog post in detail using its unique identifier.

### 3.3 Engagement & Interaction
- **Like/Dislike System**:
    - Authenticated users can "Like" a blog post.
    - Authenticated users can "Dislike" a blog post.
    - Users should only be able to have one interaction (either like or dislike) per post.

## 4. Non-Functional Requirements
- **Security**:
    - Passwords must be hashed before storage (using bcrypt).
    - Protected routes must require a valid JWT (JSON Web Token).
    - Session management should be handled via secure cookies.
- **Performance**:
    - Media uploads should be handled efficiently (using ImageKit).
    - Database queries for blog lists should be paginated to prevent performance degradation.
- **Reliability**:
    - Input validation should be performed on the server side (using Zod) to ensure data integrity.

## 5. Success Metrics
- User registration growth.
- Average number of blogs created per user.
- Engagement rate (Likes/Dislikes per blog).
