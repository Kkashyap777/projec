from rest_framework import serializers
from .models import Student, Faculty, Mentor, Mentoring, Task, MentorAssignment, MentoringActivity

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = "__all__"

class MentorSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.name')
    student_enrolment = serializers.ReadOnlyField(source='student.enrolment_no')
    faculty_name = serializers.ReadOnlyField(source='faculty.fact_name')
    faculty_id_str = serializers.ReadOnlyField(source='faculty.fact_id')

    class Meta:
        model = Mentor
        fields = "__all__"

class MentoringSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.name')

    class Meta:
        model = Mentoring
        fields = "__all__"

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"

class MentorAssignmentSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.name')
    student_enrolment = serializers.ReadOnlyField(source='student.enrolment_no')
    student_department = serializers.ReadOnlyField(source='student.department')
    student_program = serializers.ReadOnlyField(source='student.program')
    student_semester = serializers.ReadOnlyField(source='student.semester')
    faculty_name = serializers.ReadOnlyField(source='faculty.fact_name')
    faculty_email = serializers.ReadOnlyField(source='faculty.email')

    class Meta:
        model = MentorAssignment
        fields = "__all__"

class MentoringActivitySerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.name')
    student_enrolment = serializers.ReadOnlyField(source='student.enrolment_no')
    student_program = serializers.ReadOnlyField(source='student.program')
    student_semester = serializers.ReadOnlyField(source='student.semester')

    class Meta:
        model = MentoringActivity
        fields = "__all__"
