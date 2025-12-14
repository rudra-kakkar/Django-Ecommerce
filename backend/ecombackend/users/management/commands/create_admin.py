from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()

class Command(BaseCommand):
    help = 'Create an admin user account'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, help='Username for the admin account')
        parser.add_argument('--email', type=str, help='Email for the admin account')
        parser.add_argument('--password', type=str, help='Password for the admin account')

    def handle(self, *args, **options):
        username = options.get('username')
        email = options.get('email')
        password = options.get('password')

        # If not provided via arguments, prompt for input
        if not username:
            username = input('Enter username: ')
        if not email:
            email = input('Enter email: ')
        if not password:
            password = input('Enter password: ')

        try:
            # Check if user already exists
            if User.objects.filter(username=username).exists():
                self.stdout.write(self.style.ERROR(f'User with username "{username}" already exists!'))
                return

            # Create admin user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                is_admin=True
            )
            self.stdout.write(self.style.SUCCESS(f'✅ Admin user "{username}" created successfully!'))
            self.stdout.write(f'   Username: {username}')
            self.stdout.write(f'   Email: {email}')
            self.stdout.write(f'   Admin: Yes')
        except IntegrityError:
            self.stdout.write(self.style.ERROR('Failed to create admin user. User might already exist.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating admin user: {str(e)}'))

