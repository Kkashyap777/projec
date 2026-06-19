# Implementation Plan - GCU Mentoring Management System (Change Request)

We will implement the requested changes to the GCU Mentoring Management System, transforming it into a role-based full-stack system for Admins and Faculty/Mentors.

---

## User Review Required

Please review the proposed approach for major requirements:
*   **Role-Based Login**: We will implement a custom `/api/login/` endpoint on the backend. In the frontend, we will build a dedicated `/login` page. The app will store the logged-in user's role and details in `localStorage` and filter API results and sidebar options accordingly.
*   **Sidebar Configuration**: We will remove the "About" and "Create" pages and add the "Mentoring", "Reports", and "Analytics" sections as requested.
*   **PDF Generation**: We will use `reportlab` on the backend to dynamically generate and download the **Student Profile Report** and **Mentoring Activity Report** PDFs.

---

## Open Questions

> [!NOTE]
> 1. **Password details**: For the Faculty members added through the "Add Faculty" screen, should we auto-generate their passwords as their `mobile` number, or should we include a `password` field in the "Add Faculty" form? (We recommend adding a password field, defaulting to `fact_id` if blank).
> 2. **CSV Import template**: For Mentor Mapping CSV import, should we provide a simple template download link? (We will implement a basic CSV template generator view or frontend download).

---

## Proposed Changes

### 1. Backend Django App (`api`)

We will update models, views, serializers, and URLs.

#### [MODIFY] [models.py](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/backend/api/models.py)
*   Keep existing `Student` and `Faculty` models.
*   Add a `OneToOneField(User)` to `Faculty` to support authentication.
*   Add `MentorAssignment` model:
    *   `student` (ForeignKey to `Student`)
    *   `faculty` (ForeignKey to `Faculty`)
    *   `assigned_date` (DateField, auto_now_add)
    *   `status` (CharField: Active, Completed, Paused)
    *   `notes` (TextField)
*   Add `MentoringActivity` model:
    *   `student` (ForeignKey to `Student`)
    *   `date_interacted` (DateField)
    *   `interacted_with` (CharField: Student, Parent, Father, Mother, Sibling, Guardian, Other)
    *   `issue` (CharField: General, Less Attendance, etc.)
    *   `interaction_type` (CharField: Call, Physical Meet, Whatsapp, SMS, Other)
    *   `remarks` (TextField)
    *   `created_at` (DateTimeField, auto_now_add)

#### [MODIFY] [serializers.py](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/backend/api/serializers.py)
*   Create serializers for `MentorAssignment` and `MentoringActivity`.
*   Include representations to resolve relationships (e.g., student name, faculty name, etc.).

#### [MODIFY] [views.py](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/backend/api/views.py)
*   Add a custom login view `api_login` that validates credentials and returns user details and roles (`admin` or `faculty`).
*   Add views/viewsets for `StudentViewSet`, `FacultyViewSet`, `MentorAssignmentViewSet`, and `MentoringActivityViewSet`.
*   Filter queries in these viewsets:
    *   If user is **Admin**: show all.
    *   If user is **Faculty**: show only students and activities related to that faculty.
*   Add report views: `student_report_pdf` and `mentoring_report_pdf` to render PDFs using `reportlab`.
*   Add `analytics_data` view to return statistics:
    *   Admin counts: total students, faculty, mappings, and sessions.
    *   Faculty counts: assigned students, completed sessions, active students, pending cases.

#### [MODIFY] [urls.py](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/backend/api/urls.py)
*   Expose URLs prefixed with `/api/` (registered via standard routers or manual paths):
    *   `/api/login/`
    *   `/api/students/`
    *   `/api/faculty/`
    *   `/api/mentor-mapping/`
    *   `/api/mentoring-activity/`
    *   `/api/student-report/`
    *   `/api/mentoring-report/`
    *   `/api/dashboard/` / `/api/analytics/`

---

### 2. Frontend React App (`frontend`)

We will restructure layout, navigation, and build the required pages.

#### [MODIFY] [App.jsx](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/frontend/src/App.jsx)
*   Incorporate login routing (`/login`).
*   Protect routes by checking `localStorage` role. If not logged in, redirect to `/login`.

#### [MODIFY] [Menu.jsx](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/frontend/src/components/Menu.jsx)
*   Adjust the sidebar structure according to the specification:
    *   Dashboard
    *   Students (Add Student, Display Students) — *Admin only*
    *   Faculty (Add Faculty, Display Faculty) — *Admin only*
    *   Mentoring (Mentor Mapping, Mentoring Activity)
    *   Reports (Student Report, Mentoring Activity Report)
    *   Analytics

#### [MODIFY] [Layout.jsx](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/frontend/src/components/Layout.jsx)
*   Replace Register/Login headers with a **Logout** button and User info (e.g. "Logged in as Admin" or Mentor name).

#### [MODIFY] [Home.jsx](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/frontend/src/pages/Home.jsx) (Dashboard)
*   Fetch and render dashboard summary cards (Total Students, Total Faculty, Total Assignments, Total Sessions) using premium MUI card designs.

#### [NEW] [Login.jsx](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/frontend/src/pages/Login.jsx)
*   Create a clean, beautiful login screen supporting Admin and Faculty credentials.

#### [NEW] [AddStudents.jsx](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/frontend/src/pages/AddStudents.jsx)
*   Add student form using MUI TextField, Select dropdowns, and submission handling.

#### [NEW] [AddFaculty.jsx](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/frontend/src/pages/AddFaculty.jsx)
*   Add faculty form with inputs for Fact ID, Name, Mobile, Email, Dept, Designation.

#### [NEW] [DisplayFaculty.jsx](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/frontend/src/pages/DisplayFaculty.jsx)
*   Table displaying faculty list.

#### [NEW] [MentorMapping.jsx](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/frontend/src/pages/MentorMapping.jsx)
*   **Left Panel**: Assign / Remove mentor mapping form, update status, CSV import/template section.
*   **Right Panel**: Table of mappings.

#### [NEW] [MentoringActivity.jsx](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/frontend/src/pages/MentoringActivity.jsx)
*   **Top Form**: Form containing Date, Student dropdown, Interacted With (dropdown), Issue (dropdown), Type of Interaction (dropdown), Remarks, with Save and Clear buttons.
*   **Bottom Table**: Table of mentoring sessions with a "Delete Row" button.

#### [NEW] [StudentReport.jsx](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/frontend/src/pages/StudentReport.jsx)
*   View to select a student, show profile layout (Basic Student Information & Academic Details), and download PDF from `/api/student-report/`.

#### [NEW] [MentoringActivityReport.jsx](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/frontend/src/pages/MentoringActivityReport.jsx)
*   View to select a student, preview information sections (Student Info, Assigned Mentor, Mentoring Sessions, Summary count), and download PDF from `/api/mentoring-report/`.

#### [NEW] [Analytics.jsx](file:///c:/Users/Lenovo/Desktop/mini%20project-test/mini-project/frontend/src/pages/Analytics.jsx)
*   Visual dashboard cards:
    *   **Admin view**: system totals.
    *   **Faculty view**: assigned students, completed sessions, active students, pending cases.

---

## Verification Plan

### Automated/Manual Backend Verification
*   We will test `/api/login/` with valid/invalid credentials.
*   We will verify `/api/students/` and other model viewsets respond with correct datasets depending on the logged-in user's role.
*   We will test PDF download routes (`/api/student-report/` and `/api/mentoring-report/`).

### Manual Frontend Verification
*   Log in as Admin -> check that all sidebar modules are visible, forms can be saved, mapping works, and PDF reports download successfully.
*   Log in as Faculty -> check that only assigned students can be seen/selected, that mentoring sessions are filterable to their students, and personal analytics are loaded.
