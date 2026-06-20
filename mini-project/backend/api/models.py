from django.db import models
from django.contrib.auth.models import User
from .constants import (
    DESIGNATION_TYPES, INTERACTION_TYPES, INTERACTED_WITH_TYPES, 
    ISSUE_TYPES, DEPARTMENT_TYPES, PROGRAM_TYPES, SEMESTER_TYPES
)

class Student(models.Model):
    enrolment_no = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=15)
    email = models.EmailField()
    department = models.CharField(max_length=50, choices=DEPARTMENT_TYPES)
    program = models.CharField(max_length=50, choices=PROGRAM_TYPES)
    semester = models.CharField(max_length=50, choices=SEMESTER_TYPES)

    def __str__(self):
        return f"{self.enrolment_no} - {self.name}"

class Faculty(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name="faculty_profile")
    fact_id = models.CharField(max_length=20, unique=True)
    fact_name = models.CharField(max_length=100)
    date_of_joining = models.DateField(null=True, blank=True)
    mobile = models.CharField(max_length=15)
    email = models.EmailField()
    department = models.CharField(max_length=50, choices=DEPARTMENT_TYPES)
    designation = models.CharField(max_length=50, choices=DESIGNATION_TYPES)

    def __str__(self):
        return f"{self.fact_id} - {self.fact_name}"

    class Meta:
        verbose_name_plural = "Faculties"

class Mentor(models.Model):
    student = models.ForeignKey(
        Student, 
        on_delete=models.CASCADE, 
        related_name="mentor_assignments"
    )
    faculty = models.ForeignKey(
        Faculty, 
        on_delete=models.CASCADE, 
        related_name="assigned_students"
    )
    assigned_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.enrolment_no} - {self.faculty.fact_name}"

class Mentoring(models.Model):
    student = models.ForeignKey(
        Student, 
        on_delete=models.CASCADE, 
        related_name="mentoring_sessions"
    )
    interacted_with = models.CharField(
        max_length=20, 
        choices=INTERACTED_WITH_TYPES, 
        default="Student"
    )
    date_interacted = models.DateField()
    issue = models.CharField(
        max_length=50, 
        choices=ISSUE_TYPES, 
        default="Less Attendance"
    )
    interaction_type = models.CharField(
        max_length=20, 
        choices=INTERACTION_TYPES, 
        default="Call"
    )
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.enrolment_no} - {self.date_interacted}"

class Task(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False, blank=True, null=True)

    def __str__(self):
        return self.title

class MentorAssignment(models.Model):
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Completed", "Completed"),
        ("Paused", "Paused"),
    ]
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="mentor_mappings"
    )
    faculty = models.ForeignKey(
        Faculty,
        on_delete=models.CASCADE,
        related_name="mentor_mappings"
    )
    assigned_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.student.enrolment_no} mapped to {self.faculty.fact_name} ({self.status})"

class MentoringActivity(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="mentoring_activities"
    )
    date_interacted = models.DateField()
    interacted_with = models.CharField(
        max_length=20,
        choices=INTERACTED_WITH_TYPES,
        default="Student"
    )
    issue = models.CharField(
        max_length=50,
        choices=ISSUE_TYPES,
        default="General"
    )
    interaction_type = models.CharField(
        max_length=20,
        choices=INTERACTION_TYPES,
        default="Call"
    )
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Activity for {self.student.name} on {self.date_interacted}"