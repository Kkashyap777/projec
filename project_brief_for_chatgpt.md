# Project Brief: GCU Mentoring System

This document contains a comprehensive description of the **GCU Mentoring System** codebase. You can copy and upload this brief (along with any codebase files or UI screenshots) to ChatGPT to help it understand the context of your project and generate accurate code changes.

---

## 1. Project Overview & Objective
The **GCU Mentoring System** is a full-stack web application designed for educational institutions to:
1. Manage student profiles.
2. Manage faculty members (who act as mentors).
3. Assign faculty mentors to students.
4. Log and track mentoring sessions (interactions, issues raised, remarks).
5. Track custom mentoring tasks.

---

## 2. Technology Stack
*   **Backend**: Python, Django 6.x, Django REST Framework (DRF), SQLite database.
*   **Frontend**: React (v19), Vite (v7), React Router DOM (v7), Material UI (MUI v7) for styling and components.
*   **Communication**: Frontend communicates with the backend REST API via standard HTTP calls (`fetch` / `axios`) to `http://127.0.0.1:8000/`. CORS is enabled globally on the backend.

---

## 3. Database Schema (Django Models)
The backend Django app (`api`) defines the database tables in `backend/api/models.py`.

### A. Constants (`backend/api/constants.py`)
Common selection choices used in models:
*   `DEPARTMENT_TYPES`: CSE, ME, MBA, Physics.
*   `PROGRAM_TYPES`: B.Tech CSE, B.Tech ME, MBA, BSc. Physics.
*   `SEMESTER_TYPES`: Semesters 1 to 8.
*   `DESIGNATION_TYPES`: Professor, Associate Professor, Assistant Professor, Lab Instructor.
*   `INTERACTION_TYPES`: Call, WhatsApp, In-Person, Email, SMS, Other.
*   `INTERACTED_WITH_TYPES`: Student, Parent.
*   `ISSUE_TYPES`: Less Attendance, Poor Performance, Discipline, Health, Other.

### B. Django Models (`backend/api/models.py`)
1.  **Student**:
    *   `enrolment_no` (CharField, unique)
    *   `name` (CharField)
    *   `mobile` (CharField)
    *   `email` (EmailField)
    *   `department` (CharField, choices=DEPARTMENT_TYPES)
    *   `program` (CharField, choices=PROGRAM_TYPES)
    *   `semester` (CharField, choices=SEMESTER_TYPES)
2.  **Faculty** (Mentors):
    *   `fact_id` (CharField, unique)
    *   `fact_name` (CharField)
    *   `date_of_joining` (DateField, optional)
    *   `mobile` (CharField)
    *   `email` (EmailField)
    *   `department` (CharField, choices=DEPARTMENT_TYPES)
    *   `designation` (CharField, choices=DESIGNATION_TYPES)
3.  **Mentor** (Assignment link):
    *   `student` (ForeignKey to Student)
    *   `faculty` (ForeignKey to Faculty)
    *   `assigned_date` (DateField, auto_now_add)
4.  **Mentoring** (Interaction logs):
    *   `student` (ForeignKey to Student)
    *   `interacted_with` (CharField, choices=INTERACTED_WITH_TYPES, default="Student")
    *   `date_interacted` (DateField)
    *   `issue` (CharField, choices=ISSUE_TYPES, default="Less Attendance")
    *   `interaction_type` (CharField, choices=INTERACTION_TYPES, default="Call")
    *   `remarks` (TextField, optional)
    *   `created_at` (DateTimeField, auto_now_add)
5.  **Task**:
    *   `title` (CharField)
    *   `completed` (BooleanField, default=False)

---

## 4. API Endpoints (Django REST Framework)
The APIs are configured using DRF viewsets and routers.

### Active URLs (`backend/api/urls.py`)
*   `http://127.0.0.1:8000/students-api/students/` -> Handles Student CRUD operations.
*   *Function-based endpoints for Tasks (old API overview)*:
    *   `/task-list/` (GET)
    *   `/task-create/` (POST)
    *   `/task-detail/<pk>/` (GET)
    *   `/task-update/<pk>/` (POST)
    *   `/task-delete/<pk>/` (DELETE)

*Note: Serializers are ready for all models in `backend/api/serializers.py` but ViewSets and URLs for `Faculty`, `Mentor`, and `Mentoring` are yet to be configured in views and urls.*

---

## 5. Frontend Structure (React + Vite)
All React code is located under `frontend/src/`.

### Layout & Navigation:
*   **`Layout.jsx`**: Global layout containing a top header bar (`AppBar`) and a permanent left navigation drawer (`Drawer` of width 240px) enclosing the `Menu.jsx` component. Content is loaded into the `<Outlet />`.
*   **`Menu.jsx`**: Sidebar navigation displaying:
    *   *General Pages*: Home, About, Create
    *   *Students Module (Collapsible)*: Add Students (`/add-students`), Display Students (`/display-students`)
    *   *Mentors Module (Collapsible)*: Add Mentors (`/add-mentors`), Display Mentors (`/display-mentors`)

### Pages:
*   **`Home.jsx` / `About.jsx`**: Current playgrounds demonstrating typography, buttons, lists, and textfields using Material UI.
*   **`DisplayStudents.jsx`**: Complete view that fetches student list from `http://127.0.0.1:8000/students-api/students/` and renders it inside an MUI `TableContainer` / `Table` with styling.

---

## 6. What Needs to Be Done (Current Development Plan)
To finish the system, the following features are planned:
1.  **Expose Backend Endpoints**: Add ViewSets for `Faculty`, `Mentor`, and `Mentoring` to `views.py` and register them in `urls.py`.
2.  **Add Students Page (`/add-students`)**: Build a form matching the Student model fields with appropriate MUI inputs (`TextField` and `Select`).
3.  **Add Mentors Page (`/add-mentors`)**: Create a form matching the Faculty model fields.
4.  **Display Mentors Page (`/display-mentors`)**: Render a table of registered faculty mentors.
5.  **Assign Mentors Page**: A view to assign mentors to students (select student, select faculty, save assignment) and display current assignments.
6.  **Record Mentoring Sessions Page**: A form to log interaction details for students, and list past records.
7.  **Dashboard Upgrade (`Home.jsx`)**: Improve the homepage with summaries of total counts (Students, Faculty, Sessions).
