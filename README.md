# Twitter Clone

A modern, full-stack social media experience inspired by Twitter, built with a polished React frontend and a powerful Node.js + Express backend. This project brings together authentication, real-time-style social interactions, profile customization, notifications, and media uploads into a sleek, production-ready clone.

It is designed to feel fast, clean, and highly interactive, with TanStack React Query powering efficient client-side data fetching and state synchronization.

## ✨ Highlights

- Secure user authentication and authorization
- Create, like, comment on, and delete posts
- Follow and unfollow users
- Discover suggested users
- Personalized profile pages with bio, links, and cover/profile images
- Notification system for likes and follows
- Cloudinary-powered image uploads for rich media posts and profile customization
- MongoDB-backed persistence for scalable social data
- Lightning-fast fetching and cache management through TanStack React Query

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Tailwind CSS
- DaisyUI
- TanStack React Query
- React Hot Toast
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cookie-based auth
- bcryptjs for password hashing
- Cloudinary for image storage and delivery
- dotenv and CORS

## 🧠 Project Features

### Authentication
- Sign up with email, username, and password
- Login with username and password
- Secure logout
- Protected routes for authenticated users
- Session-based auth using cookies and JWT

### Social Feed
- Browse all posts from the community
- View posts from followed users
- See user-specific posts on profile pages
- Create posts with text and optional image attachments
- Like and unlike posts instantly
- Comment on posts

### User Profiles
- View public profiles by username
- Update display name, username, email, bio, link, and images
- Upload profile and cover images through Cloudinary

### Notifications
- Receive follow and like notifications
- View and delete notifications
- Mark notifications as seen

### Performance & UX
- Efficient caching and background refetching with TanStack React Query
- Smooth updates after mutations such as follows, likes, profile changes, and post creation
- Modern UI with responsive styling and skeleton loading states


## ⚙️ Installation

### Prerequisites
- Node.js (v18 or newer recommended)
- MongoDB instance
- Cloudinary account

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd twitter_clone
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root with the following variables:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## ▶️ Running the Application

### Start the backend

From the root folder:

```bash
npm run dev
```

### Start the frontend

From the frontend folder:

```bash
cd frontend
npm run dev
```

The frontend will typically run at:
- http://localhost:3000

The backend will run at:
- http://localhost:8000

## 📡 API Documentation

Base URL:

```bash
http://localhost:8000/api
```

All API routes are protected unless explicitly noted.

### Authentication

#### 1. Get current authenticated user
- Method: GET
- Route: `/api/auth/me`
- Auth Required: Yes
- Description: Returns the authenticated user profile.

#### 2. Sign up
- Method: POST
- Route: `/api/auth/signup`
- Auth Required: No
- Body:
  ```json
  {
    "fullname": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### 3. Login
- Method: POST
- Route: `/api/auth/login`
- Auth Required: No
- Body:
  ```json
  {
    "username": "johndoe",
    "password": "password123"
  }
  ```

#### 4. Logout
- Method: POST
- Route: `/api/auth/logout`
- Auth Required: Yes
- Description: Clears the auth cookie.

---

### Posts

#### 1. Get all posts
- Method: GET
- Route: `/api/posts/all`
- Auth Required: Yes
- Description: Returns all posts sorted by newest first.

#### 2. Get posts from followed users
- Method: GET
- Route: `/api/posts/following`
- Auth Required: Yes
- Description: Returns posts from users the current account is following.

#### 3. Get posts by username
- Method: GET
- Route: `/api/posts/user/:username`
- Auth Required: Yes
- Description: Returns posts created by a specific user.

#### 4. Get liked posts of a user
- Method: GET
- Route: `/api/posts/likes/:id`
- Auth Required: Yes
- Description: Returns posts liked by the given user.

#### 5. Create a post
- Method: POST
- Route: `/api/posts/create`
- Auth Required: Yes
- Body:
  ```json
  {
    "text": "This is my first post",
    "img": "base64-or-image-url"
  }
  ```

#### 6. Like or unlike a post
- Method: POST
- Route: `/api/posts/like/:id`
- Auth Required: Yes
- Description: Toggles the like state for the specified post.

#### 7. Comment on a post
- Method: POST
- Route: `/api/posts/comment/:id`
- Auth Required: Yes
- Body:
  ```json
  {
    "text": "Amazing post!"
  }
  ```

#### 8. Delete a post
- Method: DELETE
- Route: `/api/posts/:id`
- Auth Required: Yes
- Description: Deletes the post if the authenticated user is the owner.

---

### Users

#### 1. Get user profile
- Method: GET
- Route: `/api/users/profile/:username`
- Auth Required: Yes
- Description: Returns the profile of a user by username.

#### 2. Get suggested users
- Method: GET
- Route: `/api/users/suggested`
- Auth Required: Yes
- Description: Returns a list of users to follow.

#### 3. Follow or unfollow a user
- Method: POST
- Route: `/api/users/follow/:id`
- Auth Required: Yes
- Description: Toggles follow state for the target user.

#### 4. Update profile
- Method: POST
- Route: `/api/users/update`
- Auth Required: Yes
- Body:
  ```json
  {
    "userName": "newusername",
    "fullName": "New Name",
    "email": "new@example.com",
    "bio": "Building something amazing",
    "link": "https://example.com",
    "profileImg": "base64-or-image-url",
    "coverImg": "base64-or-image-url",
    "currentPassword": "oldpass",
    "newPassword": "newpass"
  }
  ```

---

### Notifications

#### 1. Get notifications
- Method: GET
- Route: `/api/notification`
- Auth Required: Yes
- Description: Returns notifications for the current user.

#### 2. Delete all notifications
- Method: DELETE
- Route: `/api/notification`
- Auth Required: Yes
- Description: Clears all notifications for the logged-in user.

#### 3. Delete a single notification
- Method: DELETE
- Route: `/api/notification/:id`
- Auth Required: Yes
- Description: Deletes one specific notification.

## 🗄️ Data Models

### User
- username
- fullname
- email
- password (hashed)
- followers
- following
- profileImg
- coverImg
- bio
- link
- likedPosts

### Post
- user
- text
- img
- likes
- comments

### Notification
- from
- to
- type
- seen

## 🚀 Notes

This project demonstrates a full social platform workflow with a clean architecture split between:
- a responsive React frontend,
- a secure Express backend,
- a MongoDB database,
- and Cloudinary-powered media handling.

The implementation is designed to feel modern, scalable, and developer-friendly while keeping the UI experience smooth and intuitive.

## 🙌 Acknowledgements

Built as a polished full-stack clone project featuring:
- MongoDB for reliable data persistence
- TanStack React Query for fast and efficient data fetching
- Cloudinary for seamless media storage and delivery
- React and Express for a strong modern web application stack
