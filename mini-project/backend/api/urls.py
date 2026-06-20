from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("students", views.StudentViewSet, basename="student")
router.register("faculty", views.FacultyViewSet, basename="faculty")
router.register("mentor-assignments", views.MentorAssignmentViewSet, basename="mentor-assignment")
router.register("mentoring-activities", views.MentoringActivityViewSet, basename="mentoring-activity")

urlpatterns = [
    # Router for ViewSets
    path("", include(router.urls)),
    
    # Authentication endpoints
    path('login/', views.api_login, name="api-login"),
    
    # Dashboard and Analytics endpoints
    path('dashboard/', views.dashboard_data, name="dashboard-data"),
    path('analytics/', views.analytics_data, name="analytics-data"),
    
    # API Overview
    path('api-overview/', views.apiOverview, name="api-overview"),
]