# GCU Mentoring Management System

A full-stack mentoring management application built for managing students, faculty, mentor assignments, mentoring activities, analytics, and reports.

## Project Overview
This project is designed to simplify and automate the mentoring workflow in an academic environment. It allows administrators and faculty members to:
- manage student records
- manage faculty records
- assign mentors to students
- record mentoring activities
- view dashboard analytics
- generate student and mentoring reports

## Tech Stack
### Backend
- Python
- Django
- Django REST Framework
- SQLite

### Frontend
- React
- Vite
- Material UI

## Project Structure
- `mini-project/backend` - Django backend API
- `mini-project/frontend` - React frontend application

## Features
- Login and authentication
- Admin dashboard
- Faculty dashboard
- Student management
- Faculty management
- Mentor assignment management
- Mentoring activity tracking
- Analytics overview
- PDF/report generation

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Kkashyap777/projec.git
cd projec
```

### 2. Setup backend
```bash
cd mini-project/backend
python -m venv venv
source venv/bin/activate   # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Setup frontend
```bash
cd ../frontend
npm install
npm run dev
```

## Default Demo Login
- Username: `admin`
- Password: `admin123`

## Notes
- The backend runs on `http://127.0.0.1:8000/`
- The frontend runs on the Vite local URL (usually `http://localhost:5173/`)

## Purpose
This system helps reduce manual paperwork, improve mentor-student tracking, and provide better reporting for academic mentoring processes.
