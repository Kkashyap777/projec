from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import HttpResponse

from .models import Student, Faculty, MentorAssignment, MentoringActivity, Task
from .serializers import (
    StudentSerializer, FacultySerializer, 
    MentorAssignmentSerializer, MentoringActivitySerializer, TaskSerializer
)

# PDF Generation imports
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

# ViewSet for Student Model
class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer

    def get_queryset(self):
        faculty_id = self.request.query_params.get('faculty_id')
        role = self.request.query_params.get('role')
        
        if role == 'faculty' and faculty_id:
            # Show only students currently assigned (Active) to this faculty
            return Student.objects.filter(mentor_mappings__faculty_id=faculty_id, mentor_mappings__status='Active').distinct()
        
        user = self.request.user
        if user.is_authenticated:
            if user.is_superuser or user.is_staff:
                return Student.objects.all()
            try:
                faculty = user.faculty_profile
                return Student.objects.filter(mentor_mappings__faculty=faculty, mentor_mappings__status='Active').distinct()
            except Faculty.DoesNotExist:
                return Student.objects.none()
        
        if faculty_id:
            return Student.objects.filter(mentor_mappings__faculty_id=faculty_id, mentor_mappings__status='Active').distinct()
            
        return Student.objects.all()

# ViewSet for Faculty Model
class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer

    def perform_create(self, serializer):
        faculty = serializer.save()
        # Auto create Django User for this faculty
        username = faculty.fact_id
        email = faculty.email
        # Default password is the mobile number, or fact_id if mobile is not provided
        password = faculty.mobile if faculty.mobile else faculty.fact_id
        
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(username=username, email=email, password=password)
            faculty.user = user
            faculty.save()

# ViewSet for MentorAssignment Model
class MentorAssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = MentorAssignmentSerializer

    def get_queryset(self):
        faculty_id = self.request.query_params.get('faculty_id')
        role = self.request.query_params.get('role')
        
        if role == 'faculty' and faculty_id:
            return MentorAssignment.objects.filter(faculty_id=faculty_id)
            
        user = self.request.user
        if user.is_authenticated and not (user.is_superuser or user.is_staff):
            try:
                faculty = user.faculty_profile
                return MentorAssignment.objects.filter(faculty=faculty)
            except Faculty.DoesNotExist:
                return MentorAssignment.objects.none()
                
        if faculty_id:
            return MentorAssignment.objects.filter(faculty_id=faculty_id)
            
        return MentorAssignment.objects.all()

# ViewSet for MentoringActivity Model
class MentoringActivityViewSet(viewsets.ModelViewSet):
    serializer_class = MentoringActivitySerializer

    def get_queryset(self):
        faculty_id = self.request.query_params.get('faculty_id')
        role = self.request.query_params.get('role')
        
        if role == 'faculty' and faculty_id:
            return MentoringActivity.objects.filter(student__mentor_mappings__faculty_id=faculty_id).distinct()
            
        user = self.request.user
        if user.is_authenticated and not (user.is_superuser or user.is_staff):
            try:
                faculty = user.faculty_profile
                return MentoringActivity.objects.filter(student__mentor_mappings__faculty=faculty).distinct()
            except Faculty.DoesNotExist:
                return MentoringActivity.objects.none()
                
        if faculty_id:
            return MentoringActivity.objects.filter(student__mentor_mappings__faculty_id=faculty_id).distinct()
            
        return MentoringActivity.objects.all()

# Custom Login API View
@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Ensure demo admin credentials work even if the DB already contains a stale admin account.
    if username == 'admin':
        admin_user = User.objects.filter(username='admin').first()
        if admin_user is None:
            admin_user = User.objects.create_superuser(
                'admin',
                'admin@example.com',
                'admin123'
            )
        elif password == 'admin123' and not admin_user.check_password('admin123'):
            admin_user.set_password('admin123')
            admin_user.save()

    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_superuser or user.is_staff:
            return Response({
                'token': 'admin-token-authenticated',
                'user': {
                    'username': user.username,
                    'role': 'admin'
                }
            })
        else:
            try:
                faculty = user.faculty_profile
                return Response({
                    'token': f'faculty-token-{faculty.fact_id}',
                    'user': {
                        'username': user.username,
                        'role': 'faculty',
                        'faculty_id': faculty.id,
                        'fact_id': faculty.fact_id,
                        'fact_name': faculty.fact_name
                    }
                })
            except Faculty.DoesNotExist:
                return Response({'error': 'User has no linked Faculty profile.'}, status=400)
    return Response({'error': 'Invalid credentials.'}, status=400)

# Analytics Data API View
@api_view(['GET'])
def analytics_data(request):
    role = request.query_params.get('role')
    faculty_id = request.query_params.get('faculty_id')
    
    is_admin = True
    user_faculty = None
    
    if request.user.is_authenticated and not (request.user.is_superuser or request.user.is_staff):
        is_admin = False
        try:
            user_faculty = request.user.faculty_profile
        except Faculty.DoesNotExist:
            pass
            
    if role == 'faculty' and faculty_id:
        is_admin = False
        try:
            user_faculty = Faculty.objects.get(id=faculty_id)
        except Faculty.DoesNotExist:
            pass
            
    if is_admin:
        return Response({
            'total_students': Student.objects.count(),
            'total_faculty': Faculty.objects.count(),
            'total_assignments': MentorAssignment.objects.count(),
            'total_sessions': MentoringActivity.objects.count()
        })
    else:
        if user_faculty:
            assigned_students = Student.objects.filter(mentor_mappings__faculty=user_faculty).distinct().count()
            completed_sessions = MentoringActivity.objects.filter(student__mentor_mappings__faculty=user_faculty).distinct().count()
            active_students = Student.objects.filter(mentor_mappings__faculty=user_faculty, mentor_mappings__status='Active').distinct().count()
            pending_cases = Student.objects.filter(mentor_mappings__faculty=user_faculty, mentor_mappings__status='Paused').distinct().count()
        else:
            assigned_students = 0
            completed_sessions = 0
            active_students = 0
            pending_cases = 0
            
        return Response({
            'assigned_students': assigned_students,
            'completed_sessions': completed_sessions,
            'active_students': active_students,
            'pending_cases': pending_cases
        })

# Dashboard Data API View
@api_view(['GET'])
def dashboard_data(request):
    role = request.query_params.get('role')
    faculty_id = request.query_params.get('faculty_id')
    
    is_admin = True
    user_faculty = None
    
    if request.user.is_authenticated and not (request.user.is_superuser or request.user.is_staff):
        is_admin = False
        try:
            user_faculty = request.user.faculty_profile
        except Faculty.DoesNotExist:
            pass
            
    if role == 'faculty' and faculty_id:
        is_admin = False
        try:
            user_faculty = Faculty.objects.get(id=faculty_id)
        except Faculty.DoesNotExist:
            pass
            
    if is_admin:
        return Response({
            'total_students': Student.objects.count(),
            'total_faculty': Faculty.objects.count(),
            'total_assignments': MentorAssignment.objects.count(),
            'total_sessions': MentoringActivity.objects.count()
        })
    else:
        if user_faculty:
            assigned_students = Student.objects.filter(mentor_mappings__faculty=user_faculty, mentor_mappings__status='Active').distinct().count()
            total_sessions = MentoringActivity.objects.filter(student__mentor_mappings__faculty=user_faculty).distinct().count()
            total_mentors = Faculty.objects.count()
        else:
            assigned_students = 0
            total_sessions = 0
            total_mentors = 0
            
        return Response({
            'total_students': assigned_students,
            'total_mentors': total_mentors,
            'total_sessions': total_sessions,
            'total_assignments': assigned_students
        })

# API Overview
@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'Login': '/api/login/',
        'Students': '/api/students/',
        'Faculty': '/api/faculty/',
        'Mentor Assignments': '/api/mentor-assignments/',
        'Mentoring Activities': '/api/mentoring-activities/',
        'Dashboard': '/api/dashboard/',
        'Analytics': '/api/analytics/',
    }
    return Response(api_urls)

# Student PDF Report
@api_view(['GET'])
def student_report_pdf(request):
    student_id = request.query_params.get('student_id')
    if not student_id:
        return HttpResponse("Student ID is required", status=400)
    try:
        student = Student.objects.get(id=student_id)
    except Student.DoesNotExist:
        return HttpResponse("Student not found", status=404)
        
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="student_report_{student.enrolment_no}.pdf"'
    
    doc = SimpleDocTemplate(response, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#1976d2'),
        alignment=1, # Center
        spaceAfter=20
    )
    section_style = ParagraphStyle(
        'SectionStyle',
        parent=styles['Heading2'],
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#0d47a1'),
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14
    )
    
    story.append(Paragraph("STUDENT PROFILE REPORT", title_style))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("Basic Student Information", section_style))
    basic_data = [
        [Paragraph("<b>Name:</b>", body_style), Paragraph(student.name, body_style)],
        [Paragraph("<b>Enrolment No:</b>", body_style), Paragraph(student.enrolment_no, body_style)],
        [Paragraph("<b>Email:</b>", body_style), Paragraph(student.email, body_style)],
        [Paragraph("<b>Mobile:</b>", body_style), Paragraph(student.mobile, body_style)],
    ]
    t1 = Table(basic_data, colWidths=[150, 350])
    t1.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#f5f5f5')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t1)
    story.append(Spacer(1, 20))
    
    story.append(Paragraph("Academic Details", section_style))
    academic_data = [
        [Paragraph("<b>Program:</b>", body_style), Paragraph(student.program, body_style)],
        [Paragraph("<b>Department:</b>", body_style), Paragraph(student.department, body_style)],
        [Paragraph("<b>Semester:</b>", body_style), Paragraph(student.semester, body_style)],
    ]
    t2 = Table(academic_data, colWidths=[150, 350])
    t2.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#f5f5f5')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t2)
    
    doc.build(story)
    return response

# Mentoring Activity PDF Report
@api_view(['GET'])
def mentoring_report_pdf(request):
    student_id = request.query_params.get('student_id')
    if not student_id:
        return HttpResponse("Student ID is required", status=400)
    try:
        student = Student.objects.get(id=student_id)
    except Student.DoesNotExist:
        return HttpResponse("Student not found", status=404)
        
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="mentoring_report_{student.enrolment_no}.pdf"'
    
    doc = SimpleDocTemplate(response, pagesize=letter, rightMargin=30, leftMargin=30, topMargin=40, bottomMargin=40)
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#2e7d32'),
        alignment=1, # Center
        spaceAfter=15
    )
    section_style = ParagraphStyle(
        'SectionStyle',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1b5e20'),
        spaceBefore=10,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontSize=9,
        leading=12
    )
    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=colors.white,
        fontName='Helvetica-Bold'
    )
    
    story.append(Paragraph("MENTORING ACTIVITY REPORT", title_style))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("Section 1: Student Information", section_style))
    student_data = [
        [Paragraph("<b>Name:</b>", body_style), Paragraph(student.name, body_style), Paragraph("<b>Enrolment No:</b>", body_style), Paragraph(student.enrolment_no, body_style)],
        [Paragraph("<b>Program:</b>", body_style), Paragraph(student.program, body_style), Paragraph("<b>Semester:</b>", body_style), Paragraph(student.semester, body_style)],
        [Paragraph("<b>Email:</b>", body_style), Paragraph(student.email, body_style), Paragraph("<b>Mobile:</b>", body_style), Paragraph(student.mobile, body_style)],
    ]
    t1 = Table(student_data, colWidths=[100, 170, 100, 170])
    t1.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#f9f9f9')),
        ('BACKGROUND', (2,0), (2,-1), colors.HexColor('#f9f9f9')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t1)
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Section 2: Assigned Mentor", section_style))
    mapping = MentorAssignment.objects.filter(student=student, status='Active').first()
    mentor_name = mapping.faculty.fact_name if mapping else "Not Assigned"
    emp_id = mapping.faculty.fact_id if mapping else "N/A"
    dept = mapping.faculty.get_department_display() if mapping else "N/A"
    
    mentor_data = [
        [Paragraph("<b>Mentor Name:</b>", body_style), Paragraph(mentor_name, body_style)],
        [Paragraph("<b>Emp ID:</b>", body_style), Paragraph(emp_id, body_style)],
        [Paragraph("<b>Department:</b>", body_style), Paragraph(dept, body_style)],
    ]
    t2 = Table(mentor_data, colWidths=[150, 390])
    t2.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#f9f9f9')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t2)
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Section 3: Mentoring Sessions", section_style))
    sessions = MentoringActivity.objects.filter(student=student).order_by('-date_interacted')
    
    table_data = [[
        Paragraph("Date", header_style),
        Paragraph("Interacted With", header_style),
        Paragraph("Issue", header_style),
        Paragraph("Interaction Type", header_style),
        Paragraph("Remarks", header_style),
    ]]
    
    for s in sessions:
        table_data.append([
            Paragraph(str(s.date_interacted), body_style),
            Paragraph(s.interacted_with, body_style),
            Paragraph(s.issue, body_style),
            Paragraph(s.interaction_type, body_style),
            Paragraph(s.remarks if s.remarks else "", body_style),
        ])
        
    t3 = Table(table_data, colWidths=[70, 95, 105, 90, 180])
    t3.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#2e7d32')),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t3)
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Section 4: Summary", section_style))
    summary_data = [
        [Paragraph("<b>Total Sessions Recorded:</b>", body_style), Paragraph(str(sessions.count()), body_style)],
    ]
    t4 = Table(summary_data, colWidths=[150, 390])
    t4.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#f9f9f9')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t4)
    
    doc.build(story)
    return response