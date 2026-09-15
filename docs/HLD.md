# High-Level Design (HLD): Blogging Platform

## 1. System Architecture
The system follows a **Client-Server Architecture** with a decoupled frontend and backend.

### 1.1 Component Overview
- **Frontend (Client)**: A React-based Single Page Application (SPA) that interacts with the backend via RESTful APIs.
- **Backend (Server)**: A Node.js/Express.js server that handles business logic, authentication, and database orchestration.
- **Database**: MongoDB (NoSQL) used for storing user profiles and blog content.
- **Media Storage**: ImageKit (Third-party Cloud Storage) for hosting images and videos uploaded by users.

## 2. Tech Stack
- **Frontend**: React, Vite, Tailwind CSS (inferred).
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: MongoDB, Mongoose.
- **Authentication**: JWT (JSON Web Tokens), Cookie-parser.
- **Media Handling**: Multer (Memory storage), ImageKit Node.js SDK, Sharp (Image processing).
- **Validation**: Zod.

## 3. Data Flow
### 3.1 Authentication Flow
1. **Register/Login**: User sends credentials $\rightarrow$ Server validates $\rightarrow$ Server generates JWT $\rightarrow$ JWT sent back in a secure cookie.
2. **Authorized Requests**: Client sends request with cookie $\rightarrow$ `authUser` middleware verifies JWT $\rightarrow$ Request proceeds to controller.

### 3.2 Blog Creation Flow
1. **Upload**: User submits form with text and media files.
2. **Processing**: `multer` handles multipart data in memory $\rightarrow$ `createBlogController` sends media to **ImageKit**.
3. **Storage**: ImageKit returns URLs $\rightarrow$ Server saves blog text and media URLs into **MongoDB**.

### 3.3 Content Consumption Flow
1. **Fetch List**: Client requests `/api/blog/display/:page/:limit` $\rightarrow$ Server queries MongoDB with pagination $\rightarrow$ Returns list of blogs.
2. **Fetch Detail**: Client requests `/api/blog/display/:id` $\rightarrow$ Server fetches specific document by ID $\rightarrow$ Returns full blog details.

## 4. System Diagrams (Conceptual)
- **Logical Layers**:
    `User Interface` $\rightarrow$ `API Gateway (Express)` $\rightarrow$ `Middleware (Auth/Validation)` $\rightarrow$ `Controllers` $\rightarrow$ `Mongoose Models` $\rightarrow$ `MongoDB`
- **External Integrations**:
    `Server` $\leftrightarrow$ `ImageKit API` (Media Uploads/Optimization)

## 5. Scalability & Constraints
- **Pagination**: Implemented on blog lists to ensure the system remains responsive as the database grows.
- **Memory Storage**: Multer uses memory storage for small files; however, very large files could stress the server's RAM.
- ** Statelessness**: The server is stateless (JWT-based), allowing for horizontal scaling behind a load balancer.
