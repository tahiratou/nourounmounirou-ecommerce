from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Crée un superuser par défaut si aucun admin n existe'

    def handle(self, *args, **options):
        User = get_user_model()
        
        # Vérifier si un superuser existe déjà
        if User.objects.filter(is_superuser=True).exists():
            self.stdout.write(self.style.SUCCESS('Un superuser existe déjà'))
            return
        
        # Créer le superuser par défaut
        username = 'amyNdoye'
        email = 'amyndoye04@gmail.com'
        password = 'Touba25,'  # Changez ce mot de passe !
        
        User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        
        self.stdout.write(self.style.SUCCESS(f'Superuser créé : {username}'))
