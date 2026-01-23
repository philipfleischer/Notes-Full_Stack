# Notes-Full_Stack

## MERN Notes Application

A full-stack MERN notes application built from scratch using MongoDB, Express, React, and Node.js.
The project focuses on clean REST API design, correct use of HTTP standards, rate limiting, security, and a modern, responsive frontend.

By the end of this project, I have built and deployed a production-ready REST API and a modern web application following real-world backend and frontend best practices.

### Live demo
Short walkthrough showing note CRUD: Creation, Read, Editing, Deletion, and API interaction.
https://github.com/user-attachments/assets/5bb9d7c5-197e-4338-ae93-469ce2731720



---

## Features

### Backend (Node.js + Express)

- RESTful API with clear resource design
- Full CRUD operations for notes
- Proper use of HTTP status codes
- Rate limiting to prevent abuse
- Input validation and structured error handling
- Secure configuration using environment variables
- MongoDB (NoSQL) data modeling with Mongoose

### Frontend (React)

- Modern React application structure
- Responsive, mobile-first design
- Clean separation of components and services
- Backend API integration
- User-friendly note creation, editing, and deletion

### General

- Clear separation between frontend and backend
- Production-ready project structure
- Git-friendly setup with `.env.example`
- Designed for deployment to cloud platforms

---

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Express Rate Limit
- dotenv

### Frontend

- React
- JavaScript (ES6+)
- CSS (Responsive Design)

### Tooling

- Git and GitHub
- REST API testing using curl / Postman
- Environment-based configuration

---

## Core Concepts Demonstrated

### REST API Design

- Predictable and consistent endpoint structure
- Proper use of HTTP verbs (GET, POST, PUT, DELETE)
- Correct HTTP status codes (200, 201, 400, 401, 404, 429, 500)
- Clear separation of routing, controllers, and models

### SQL vs NoSQL

This project uses MongoDB (NoSQL) instead of a relational database because:

- Notes benefit from flexible and evolving schemas
- Faster iteration during development
- Natural fit for JSON-based REST APIs

### Rate Limiting

To protect the API from abuse and denial-of-service scenarios:

- Requests are limited per IP address
- Excessive requests receive HTTP 429 responses

This mirrors common requirements in production backend systems.

---

## Project Structure

- mern-notes-app/
  - backend/
    - src/
      - routes/
      - controllers/
      - models/
      - middleware/
      - server.js
    - .env.example
    - package.json
  - frontend/
    - src/
      - components/
      - pages/
      - services/
      - App.jsx
    - package.json
  - .gitignore
  - README.md

---

## API Overview

### Notes Endpoints

| Method | Endpoint       | Description             |
| ------ | -------------- | ----------------------- |
| GET    | /api/notes     | Retrieve all notes      |
| GET    | /api/notes/:id | Retrieve a note by ID   |
| POST   | /api/notes     | Create a new note       |
| PUT    | /api/notes/:id | Update an existing note |
| DELETE | /api/notes/:id | Delete a note           |

---

## Environment Variables

Create a `.env` file in the `backend/` directory based on the example below:
PORT=5000
MONGO_URI=your_mongodb_connection_string
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

Environment files are excluded from version control.
A `.env.example` file is provided for reference.

---

## Running the Project Locally

### Backend

cd backend
npm install
npm run dev

### Frontend

cd frontend
npm install
npm run dev

The frontend communicates with the backend through the REST API.

---

## Deployment

The application is designed to be deployed using:

- Cloud hosting platforms (e.g. Vercel, Render, Railway)
- MongoDB Atlas for database hosting
- Environment-based configuration

Frontend and backend are deployable independently.

---

## Testing and Validation

- API endpoints tested using curl and Postman
- Error handling verified for invalid requests
- Rate limiting tested through repeated requests

---

## Project Motivation

This project is designed to demonstrate:

- Real-world full-stack architecture
- Backend engineering best practices
- Clean REST API design
- Security-aware development
- Production-oriented thinking

It is built specifically as a portfolio project to showcase professional-level development skills.

---
