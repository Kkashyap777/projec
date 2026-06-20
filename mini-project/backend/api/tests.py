from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient


class LoginAPITests(TestCase):
    def test_admin_login_resets_demo_credentials_when_needed(self):
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='stale-password'
        )
        admin_user.set_password('stale-password')
        admin_user.save()

        client = APIClient()
        response = client.post('/api/login/', {
            'username': 'admin',
            'password': 'admin123'
        }, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['role'], 'admin')
