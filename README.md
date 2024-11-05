# Social Media Application

This repository contains the source code for a full-stack social media application. The project is built with the MERN stack (MySQL, Express.js, React.js/Next.js, Node.js) and is intended to offer features such as user authentication, posting content, liking posts, Commenting users, and more.

## Table of Contents

- [Social Media Application](#social-media-application)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
  - [Project Structure](#project-structure)
  - [Technologies Used](#technologies-used)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
  - [Deployment](#deployment)
  - [Available Scripts](#available-scripts)
    - [Backend Scripts](#backend-scripts)
    - [Frontend Scripts](#frontend-scripts)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [Posts](#posts)
    - [Users](#users)
    - [Likes and Comments](#likes-and-comments)
  - [Features](#features)
  - [License](#license)

## Getting Started

Follow these instructions to get the project up and running locally for development and testing purposes.

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL database

## Project Structure

The project is organized into two main directories:

- **backend/**: Contains the Node.js/Express.js server, routes, models, and services.
- **frontend/**: Contains the Next.js application for the user interface.

## Technologies Used

- **Backend**: Node.js, Express.js, MySQL
- **Frontend**: React.js, Next.js, Tailwind CSS
- **Authentication**: JSON Web Tokens (JWT)
- **Real-time Notifications**: Socket.io
- **Deployment**: Render.com

## Backend Setup

To run the backend server locally:

1. Navigate to the backend directory:

   ```sh
   cd backend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up a MySQL database and update the `.env` file with your database credentials:

   ```env
   PORT=5000
   MYSQL_DATABASE="social_media_db"
   MYSQL_HOST="localhost"
   MYSQL_USER="your_user"
   MYSQL_PASSWORD="your_password"
   JWT_SECRET="your_secret_key"
   JWT_EXPIRES_IN="1h"
   ```

4. Start the backend server:

   ```sh
   npm run dev
   ```

5. The server will be running on [http://localhost:5000](http://localhost:5000).

## Frontend Setup

To run the frontend application locally:

1. Navigate to the frontend directory:

   ```sh
   cd frontend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the frontend server:

   ```sh
   npm run dev
   ```

4. The application will be running on [http://localhost:3000](http://localhost:3000).

## Environment Variables

The project requires the following environment variables for the backend:

- `MYSQL_DATABASE`: The name of your MySQL database.
- `MYSQL_HOST`: Database host.
- `MYSQL_USER`: Database username.
- `MYSQL_PASSWORD`: Database password.
- `JWT_SECRET`: Secret key for JWT authentication.
- `PORT`: Port on which the backend server runs.

For deployment, ensure all environment variables are properly configured on the hosting platform.

## Deployment

The project is deployed on [Render](https://render.com).

- **Backend**: []()
- **Frontend**: []()

## Available Scripts

### Backend Scripts

- **`npm run dev`**: Starts the development server with nodemon.
- **`npm start`**: Starts the production server.

### Frontend Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the application for production.
- **`npm start`**: Starts the production server.

## API Endpoints

Below is a list of the main API endpoints used in the project:

### Authentication

- **POST `/api/users/register`**: Register a new user.
- **POST `/api/users/login`**: Login for existing users.

### Posts

- **GET `/api/posts`**: Retrieve all posts.
- **POST `/api/posts/all?page=1&limit=5`**: Create a new post (requires authentication).

### Users

- **GET `/api/users/all-users`**: Retrieve user information.

### Likes and Comments

- **POST `/api/posts/like`**: Like a post (requires authentication).
- **POST `/api/posts/comment`**: Add a comment to a post (requires authentication).

## Features

- **User Authentication**: Registration, login, and protected routes.
- **Posts**: Users can create, like, and comment on posts.
- **Followers**: Users can follow and unfollow other users.
- **Notifications**: Real-time notifications via Socket.io for actions like likes, comments, and follows.
- **Responsive UI**: Built with Tailwind CSS.

## License

This project is licensed under the MIT License.
