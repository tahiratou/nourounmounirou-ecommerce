# 🚀 Guide de Démarrage Rapide - NourounMounirou

## Installation en 5 minutes

### 1️⃣ Installation des prérequis (une seule fois)

Téléchargez et installez :
- Python 3.10+ : https://www.python.org/downloads/
- Node.js 18+ : https://nodejs.org/
- PostgreSQL : https://www.postgresql.org/download/

### 2️⃣ Setup du Backend

```bash
# Accéder au dossier backend
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement (Windows)
venv\Scripts\activate
# OU sur Mac/Linux
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Copier et configurer .env
cp .env.example .env
# Éditez .env avec vos informations PostgreSQL

# Initialiser la base de données
python manage.py migrate

# Créer les catégories (ouvrir le shell Django)
python manage.py shell
```

Dans le shell Python qui s'ouvre, copiez-collez :
```python
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

exit()
```

```bash
# Créer un compte admin
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
```

✅ Le backend est maintenant sur http://localhost:8000

### 3️⃣ Setup du Frontend (dans un NOUVEAU terminal)

```bash
# Accéder au dossier frontend
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

✅ Le frontend est maintenant sur http://localhost:5173

### 4️⃣ Premier test

1. Ouvrez http://localhost:5173
2. Cliquez sur "Connexion"
3. Entrez vos identifiants admin créés à l'étape 2
4. Vous êtes maintenant dans l'interface admin !

---

## 📋 Checklist de vérification

- [ ] Python, Node.js et PostgreSQL installés
- [ ] Base de données PostgreSQL créée
- [ ] Environnement virtuel activé (vous voyez `(venv)` dans le terminal)
- [ ] Fichier `.env` configuré avec DATABASE_URL
- [ ] Migrations appliquées
- [ ] Catégories créées
- [ ] Compte superuser créé
- [ ] Backend qui tourne sur http://localhost:8000
- [ ] Frontend qui tourne sur http://localhost:5173
- [ ] Connexion réussie dans l'interface admin

---

## 🎯 Utilisation quotidienne

### Démarrer le projet

**Terminal 1 (Backend) :**
```bash
cd backend
venv\Scripts\activate  # Windows
# OU source venv/bin/activate  # Mac/Linux
python manage.py runserver
```

**Terminal 2 (Frontend) :**
```bash
cd frontend
npm run dev
```

### Arrêter le projet

Appuyez sur `Ctrl+C` dans chaque terminal.

---

## 🐛 Problèmes courants

### "Command not found"
→ Vérifiez que Python/Node/PostgreSQL sont installés et dans le PATH

### "No module named 'django'"
→ Activez l'environnement virtuel : `venv\Scripts\activate`

### "Connection refused" sur le frontend
→ Vérifiez que le backend tourne sur le port 8000

### "CORS error"
→ Vérifiez `CORS_ALLOWED_ORIGINS` dans `backend/nourounmounirou/settings.py`

---

## 📞 Besoin d'aide ?

Consultez le README.md complet pour plus de détails !
