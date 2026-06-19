# TODO — GCU Mentoring Management System (React + Django)

## Frontend
- [ ] Replace Home with Dashboard route + page
- [ ] Update sidebar menu:
  - [ ] Rename Home → Dashboard
  - [ ] Remove About + Create
  - [ ] Keep Students module (Add Student / Display Students)
  - [ ] Rename Mentors submenu → Faculty (Add Faculty / Display Faculty)
  - [ ] Add Mentoring (Mentor Mapping, Mentoring Activity)
  - [ ] Add Reports (Student Report, Mentoring Activity Report)
  - [ ] Add Analytics
- [ ] Implement login UI and auth state (Admin vs Faculty)
- [ ] Implement role-based route/page access
- [ ] Implement Dashboard cards using `/api/dashboard/`
- [ ] Implement Mentor Mapping page (left/right panels, table, status updates, CSV import/template)
- [ ] Implement Mentoring Activity page with tabs
- [ ] Implement Student Report PDF download via `/api/student-report/`
- [ ] Implement Mentoring Activity Report PDF download via `/api/mentoring-report/`
- [ ] Implement Analytics cards via `/api/analytics/`

## Backend
- [ ] Ensure models match requirements (MentorAssignment, MentoringActivity already exist; confirm fields)
- [ ] Update `backend/api/urls.py` to expose required endpoints under `/api/*`
- [ ] Add missing DRF routes/viewsets for faculty, mentor mapping, mentoring activity
- [ ] Enforce role-based queryset filtering for faculty vs admin
- [ ] Connect dashboard analytics endpoint to `/api/dashboard/` if separate from `/api/analytics/`
- [ ] Implement login auth so frontend can call protected endpoints (token → DRF auth)

## Verification
- [ ] Run backend migrations
- [ ] Test API endpoints in browser/Postman
- [ ] Run frontend dev server and verify sidebar + pages
- [ ] Validate PDF generation endpoints with sample student_id

