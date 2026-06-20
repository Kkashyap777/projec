from django.contrib import admin
from .models import Student, Faculty, Mentor, Mentoring, Task

admin.site.register(Student)
admin.site.register(Faculty)
admin.site.register(Mentor)
admin.site.register(Mentoring)
admin.site.register(Task)
