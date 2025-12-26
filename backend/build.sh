#!/usr/bin/env bash
# Script de build pour Render.com
set -o errexit

# Installation des dépendances
pip install -r requirements.txt

# Collecte des fichiers statiques
python manage.py collectstatic --no-input

python manage.py makemigrations

# Application des migrations
python manage.py migrate

# Création des catégories par défaut
python manage.py shell << EOF
from products.models import Category

categories = [
    {'name': 'vaisselle', 'display_name': 'Vaisselle', 'emoji': '🍽️'},
    {'name': 'tissus', 'display_name': 'Tissus', 'emoji': '🧵'},
    {'name': 'habits', 'display_name': 'Habits', 'emoji': '👕'},
    {'name': 'chaussures', 'display_name': 'Chaussures', 'emoji': '👞'},
    {'name': 'autres', 'display_name': 'Autres', 'emoji': '📦'},
]

for cat in categories:
    Category.objects.get_or_create(**cat)

print("Build terminé avec succès!")
EOF

# Créer le superuser
python manage.py initadmin