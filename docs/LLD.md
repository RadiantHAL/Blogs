# Low-Level Design (LLD): Blogging Platform

## 1. Data Models (MongoDB / Mongoose)

### 1.1 User Model
- **Field**: `email` (String, unique, required)
- **Field**: `password` (String, required)
- **Purpose**: Stores user account credentials and authentication data.

### 1.2 Blog Model
- **Field**: `title` (String, required)
- **Field**: `content` (String, required)
- **Field**: `author` (ObjectId, ref: 'User', required)
- **Field**: `media` (Array of Strings - URLs from ImageKit)
- **Field**: `likes` (Array of ObjectIds, ref: 'User')
- **Field**: `dislikes` (Array of ObjectIds, ref: 'User')
- **Field**: `createdAt` (Date, default: Date.now)
- **Purpose**: Stores the actual blog content, associated media, and interaction counts.

## 2. API Endpoints

### 2.1 Authentication API (`/api/auth`)
| Endpoint | Method | Auth | Description | Key Logic |
| :--- | :--- | :--- | :--- | :--- |
| `/register` | POST | Public | Create new account | Hash password with `bcryptjs` $\rightarrow$ Save to DB |
| `/login` | POST | Public | Authenticate user | Compare hash $\rightarrow$ Generate JWT $\rightarrow$ Set Cookie |
| `/logout` | GET | Public | End session | Clear cookie $\rightarrow$ Blacklist token (if applicable) |
| `/get-me` | GET | Private | Get user profile | Verify JWT $\rightarrow$ Fetch User by ID from token |

### 2.2 Blog API (`/api/blog`)
| Endpoint | Method | Auth | Description | Key Logic |
| :--- | :--- | :--- | :--- | :--- |
| `/create` | POST | Private | Create new post | `multer` upload $\rightarrow$ ImageKit upload $\rightarrow$ Save Blog to DB |
| `/display/:page/:limit`| GET | Public | List blogs | MongoDB `.find().skip().limit()` |
| `/:id/like` | PATCH | Private | Like a post | Push `userId` to `likes` array, remove from `dislikes` |
| `/:id/dislike` | PATCH | Private | Dislike a post | Push `userId` to `dislikes` array, remove from `likes` |
| `/display/:id` | GET | Private | Detailed view | Fetch Blog by ID $\rightarrow$ Populate `author` field |

## 3. Detailed Logic & Middleware

### 3.1 Authentication Middleware (`authUser`)
- Extracts token from request cookies.
- Verifies JWT using a secret key.
- Attaches `userId` to the `req` object for use in controllers.

### 3.2 File Upload Logic
- **Multer Configuration**: 
    - Storage: `memoryStorage()`.
    - Limit: 10MB per file, max 10 files.
    - Filter: Only `image/*` and `video/*`.
- **ImageKit Integration**:
    - The `createBlogController` iterates through `req.files`.
    - Uploads each file buffer to ImageKit using `imagekit.upload`.
    - Collects the resulting `url` for storage in the Blog model.

### 3.3 Interaction Logic (Like/Dislike)
- To prevent double-voting:
    - If User likes: `$addToSet` in `likes`, `$pull` from `dislikes`.
    - If User dislikes: `$addToSet` in `dislikes`, `$pull` from `likes`.

## 4. Error Handling
- **Validation**: Zod is used to validate request bodies.
- **Global Middleware**: Errors are caught and returned as JSON responses with appropriate HTTP status codes (400 for bad requests, 401 for unauthorized, 500 for server errors).
