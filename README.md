# Task Management System

## Project Overview

Task Management System is a full-stack web application developed as part of the Full Stack Developer Technical Assessment.

The application allows users to securely manage their tasks through an interactive dashboard. Users can log in, create tasks, update task information, manage task status and priorities, and monitor task progress.

This project demonstrates full-stack development skills including frontend development, backend API implementation, MySQL database integration, authentication, and responsive user interface development.


## Features

- User authentication with JWT
- Secure login functionality
- Create, view, update, and delete tasks
- Task status management
- Task priority management
- Due date tracking
- Dashboard statistics
- Recent task overview
- Responsive UI design
- Dark and light theme support
- Protected routes for authenticated users


# Technology Stack

## Frontend

- React.js
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast


## Backend

- Node.js
- Express.js
- TypeScript
- JWT Authentication
- bcryptjs
- CORS
- dotenv


## Database

- MySQL


## Development Tools

- Git
- GitHub
- Visual Studio Code


# Project Structure

```

task-management
│
├── backend              # Backend API application
│
├── frontend             # React frontend application
│
├── database             # SQL database files
│
├── .env.example         # Environment variable example
│
└── README.md

````


# Installation Instructions

## 1. Clone Repository

```bash
git clone https://github.com/kanikalansooriya/task-management.git

cd task-management
````

## 2. Backend Installation

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

## 3. Frontend Installation

Open another terminal and navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

# Environment Variables

## Backend Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=task_management

JWT_SECRET=your_secret_key
```

## Frontend Environment Variables

Create a `.env` file inside the frontend folder.

Example:

```env
VITE_API_URL=http://localhost:5000
```

# Database Setup

This project uses MySQL as the database.

## 1. Create Database

Open MySQL and create the database:

```sql
CREATE DATABASE task_management;
```

## 2. Import SQL Dump

Import the provided SQL dump file:

```
database/task_management.sql
```

This file contains the required database structure.

## Database Tables

### Users Table

Stores user authentication information.

Fields:

* id
* name
* email
* password

### Tasks Table

Stores task information.

Fields:

* id
* title
* description
* status
* priority
* dueDate
* userId

# Running the Backend

Navigate to the backend folder:

```bash
cd backend
```

Start the development server:

```bash
npm run dev
```

Backend server runs on:

```
http://localhost:5000
```

# Running the Frontend

Navigate to the frontend folder:

```bash
cd frontend
```

Start the development server:

```bash
npm run dev
```

Frontend application runs on:

```
http://localhost:3000
```

# API Documentation

## Authentication API

## Login User

**POST**

```
/api/auth/login


Request Body:

json
{
  "email": "admin@test.com",
  "password": "123456"
}


Response:

json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@test.com"
  }
}
```

# Task APIs

## Get All Tasks

**GET**

```
/api/tasks
```

Returns all tasks for the authenticated user.

## Create Task

**POST**

```
/api/tasks
```

Request Body:

```json
{
  "title": "Complete Assessment",
  "description": "Finish task management project",
  "priority": "High",
  "status": "Pending",
  "dueDate": "2026-07-25"
}
```
## Update Task

**PUT**

/api/tasks/:id

## Delete Task

**DELETE**

/api/tasks/:id

# Dashboard API

## Get Dashboard Statistics

**GET**

/api/dashboard
Returns:

* Total tasks
* Pending tasks
* In-progress tasks
* Completed tasks
* Overdue tasks

# Assumptions Made

* Users must authenticate before accessing task features.
* Each user manages their own tasks.
* JWT authentication is used to maintain user sessions.
* MySQL is used as the primary database.
* Task status and priority values follow predefined options.
* The application is designed for individual task management.

# Known Limitations

* No password reset functionality.
* No email verification system.
* No task sharing between users.
* No file attachment support.
* No advanced reporting features.
* Pagination is not implemented for large datasets.

# Future Improvements

* Add user roles and permissions.
* Add task collaboration features.
* Add notifications and reminders.
* Implement automated testing.
* Deploy frontend and backend applications to cloud platforms.

# URLs

## Frontend URL

Not deployed.
Available locally:
http://localhost:3000

## Backend URL

Not deployed.
Available locally:
http://localhost:5000
