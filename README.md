# 🛍️ NourounMounirou - Site E-commerce

Site e-commerce complet avec React/Vite (frontend) et Django (backend) une boutique en ligne.

## 📋 Technologies utilisées

### Backend
- **Django 4.2** - Framework Python
- **Django REST Framework** - API REST
- **PostgreSQL** - Base de données (déployable gratuitement)
- **Pillow** - Gestion des images
- **django-cors-headers** - Gestion CORS

### Frontend
- **React 18** - Bibliothèque JavaScript
- **Vite** - Build tool rapide
- **React Router** - Navigation
- **Axios** - Requêtes HTTP
- **Lucide React** - Icônes

## 🚀 Installation - Étapes détaillées

### Prérequis

Vous devez installer les logiciels suivants sur votre ordinateur :

1. **Python 3.10+** : https://www.python.org/downloads/
2. **Node.js 18+** et npm : https://nodejs.org/
3. **PostgreSQL** : https://www.postgresql.org/download/ (pour le développement local)
   - Ou utilisez un service gratuit comme [ElephantSQL](https://www.elephantsql.com/) ou [Neon](https://neon.tech/)
4. **Git** : https://git-scm.com/downloads

### Vérification des installations

Ouvrez un terminal et vérifiez que tout est installé :

```bash
python --version    # Doit afficher Python 3.10 ou supérieur
node --version      # Doit afficher v18 ou supérieur
npm --version       # Doit afficher 9.x ou supérieur
psql --version      # Doit afficher PostgreSQL 12 ou supérieur
```

---

## 📦 Installation du Backend (Django)

### 1. Accéder au dossier backend

```bash
cd backend
```

### 2. Créer un environnement virtuel Python

**Sur Windows :**
```bash
python -m venv venv
venv\Scripts\activate
```

**Sur macOS/Linux :**
```bash
python3 -m venv venv
source venv/bin/activate
```

Vous verrez `(venv)` apparaître dans votre terminal.

### 3. Installer les dépendances Python

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configurer la base de données PostgreSQL

#### Option A : PostgreSQL local

1. Créez une base de données PostgreSQL :

```bash
# Connectez-vous à PostgreSQL
psql -U postgres

# Dans psql, créez la base de données
CREATE DATABASE nourounmounirou_db;
CREATE USER nouroun_user WITH PASSWORD 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE nourounmounirou_db TO nouroun_user;
\q
```

2. Votre `DATABASE_URL` sera :
```
postgresql://nouroun_user:votre_mot_de_passe_securise@localhost:5432/nourounmounirou_db
```

#### Option B : Base de données gratuite en ligne

**Avec ElephantSQL (gratuit) :**
1. Inscrivez-vous sur https://www.elephantsql.com/
2. Créez une nouvelle instance (plan Tiny Turtle - gratuit)
3. Copiez l'URL de connexion fournie (elle ressemble à : `postgres://utilisateur:password@host/database`)

**Avec Neon (gratuit) :**
1. Inscrivez-vous sur https://neon.tech/
2. Créez un nouveau projet
3. Copiez l'URL de connexion fournie

### 5. Créer le fichier .env

Copiez `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos informations :

```env
# Configuration de la base de données
DATABASE_URL=postgresql://nouroun_user:votre_mot_de_passe@localhost:5432/nourounmounirou_db

# Configuration Django
SECRET_KEY=votre-cle-secrete-changez-moi-en-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Configuration WhatsApp (à configurer plus tard via l'interface admin)
WHATSAPP_NUMBER=
```

**⚠️ IMPORTANT :** Pour générer une SECRET_KEY sécurisée, utilisez :

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 6. Initialiser la base de données

```bash
# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate
```

### 7. Créer les catégories par défaut

Ouvrez un shell Django :

```bash
python manage.py shell
```

Puis exécutez :

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

print("Catégories créées avec succès!")
exit()
```

### 8. Créer un compte administrateur

```bash
python manage.py createsuperuser
```

Suivez les instructions pour créer votre compte admin :
- Nom d'utilisateur : (ex: admin ou le prénom de votre maman)
- Email : (optionnel)
- Mot de passe : (choisissez un mot de passe sécurisé)

### 9. Lancer le serveur backend

```bash
python manage.py runserver
```

Le backend sera accessible sur : **http://localhost:8000**

Pour vérifier que tout fonctionne, ouvrez : http://localhost:8000/admin

---

## 🎨 Installation du Frontend (React)

### 1. Ouvrir un NOUVEAU terminal

Laissez le serveur Django tourner, ouvrez un nouveau terminal.

### 2. Accéder au dossier frontend

```bash
cd frontend
```

### 3. Installer les dépendances Node.js

```bash
npm install
```

Cette commande peut prendre quelques minutes.

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Le frontend sera accessible sur : **http://localhost:5173**

---

## ✅ Vérification de l'installation

1. **Backend** : http://localhost:8000/admin (vous devriez voir l'interface admin Django)
2. **Frontend** : http://localhost:5173 (vous devriez voir la boutique)
3. **API** : http://localhost:8000/api/products/products/ (vous devriez voir `{"count":0,"next":null,"previous":null,"results":[]}`)

---

## 🎯 Utilisation

### Pour votre maman (Administratrice)

1. Aller sur le site : http://localhost:5173
2. Cliquer sur "Connexion" en haut à droite
3. Se connecter avec les identifiants créés (createsuperuser)
4. Elle verra automatiquement le panneau d'administration avec 3 onglets :

   - **Mes Produits** : Voir et supprimer les produits
   - **Ajouter un produit** : Formulaire simple pour ajouter :
     - Nom du produit
     - Catégorie
     - Description
     - Prix en FCFA
     - Emoji (optionnel)
     - Image (optionnel)
   - **Paramètres** : Configurer le numéro WhatsApp

### Pour les clients

Les clients visitent http://localhost:5173 et peuvent :
- Voir tous les produits
- Filtrer par catégorie
- Rechercher des produits
- Cliquer sur "Commander sur WhatsApp" pour contacter votre maman

---

## 🌐 Déploiement GRATUIT

### Option 1 : Render (Recommandé - 100% gratuit)

#### Backend Django sur Render

1. **Créer un compte sur Render** : https://render.com/

2. **Préparer le projet** :
   - Créez un fichier `build.sh` dans le dossier backend :

```bash
#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
```

   - Rendez-le exécutable :
```bash
chmod +x build.sh
```

3. **Créer une base de données PostgreSQL sur Render** :
   - Dashboard → New → PostgreSQL
   - Copiez l'URL "Internal Database URL"

4. **Déployer le backend** :
   - Dashboard → New → Web Service
   - Connectez votre dépôt GitHub
   - Configurez :
     - **Name** : nourounmounirou-api
     - **Environment** : Python 3
     - **Build Command** : `./build.sh`
     - **Start Command** : `gunicorn nourounmounirou.wsgi:application`
     - **Environment Variables** :
       ```
       DATABASE_URL=<votre_internal_database_url>
       SECRET_KEY=<votre_secret_key>
       DEBUG=False
       ALLOWED_HOSTS=nourounmounirou-api.onrender.com
       ```

#### Frontend React sur Render

1. **Build le frontend localement** :
```bash
cd frontend
npm run build
```

2. **Déployer sur Render** :
   - Dashboard → New → Static Site
   - Connectez votre dépôt GitHub
   - Configurez :
     - **Build Command** : `cd frontend && npm install && npm run build`
     - **Publish Directory** : `frontend/dist`

3. **Mettre à jour l'URL de l'API** dans `frontend/src/services/api.js` :
```javascript
const API_URL = 'https://nourounmounirou-api.onrender.com/api';
```

### Option 2 : Vercel (Frontend) + Railway (Backend)

#### Backend sur Railway

1. Créer un compte sur Railway : https://railway.app/
2. New Project → Deploy from GitHub
3. Ajouter PostgreSQL depuis les plugins
4. Configurer les variables d'environnement
5. Le backend sera déployé automatiquement

#### Frontend sur Vercel

1. Créer un compte sur Vercel : https://vercel.com/
2. Import Project → Connecter GitHub
3. Framework Preset : Vite
4. Deploy

### Configuration CORS pour la production

Dans `backend/nourounmounirou/settings.py`, ajoutez votre domaine frontend :

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://votre-site-frontend.vercel.app',  # Ajoutez votre domaine
]
```

---

## 📱 Fonctionnalités

### Pour l'administratrice (votre maman)
✅ Interface simple et intuitive  
✅ Ajout de produits avec images  
✅ Gestion des catégories  
✅ Configuration du WhatsApp  
✅ Suppression de produits  
✅ Responsive (fonctionne sur mobile)

### Pour les clients
✅ Navigation par catégories  
✅ Recherche de produits  
✅ Contact direct via WhatsApp  
✅ Design moderne et responsive  
✅ Chargement rapide

---

## 🛠️ Commandes utiles

### Backend (Django)

```bash
# Lancer le serveur
python manage.py runserver

# Créer des migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un super utilisateur
python manage.py createsuperuser

# Collecter les fichiers statiques
python manage.py collectstatic

# Ouvrir le shell Django
python manage.py shell
```

### Frontend (React)

```bash
# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
```

---

## 🐛 Résolution de problèmes

### Le backend ne démarre pas
- Vérifiez que l'environnement virtuel est activé : `(venv)` doit apparaître
- Vérifiez la connexion à PostgreSQL
- Vérifiez que toutes les migrations sont appliquées : `python manage.py migrate`

### Le frontend ne se connecte pas au backend
- Vérifiez que le backend tourne sur http://localhost:8000
- Vérifiez le fichier `frontend/vite.config.js` pour le proxy
- Ouvrez la console du navigateur (F12) pour voir les erreurs

### Images ne s'affichent pas
- Vérifiez que le dossier `media/` existe dans le backend
- Vérifiez les permissions du dossier
- Vérifiez la configuration `MEDIA_ROOT` dans `settings.py`

### Erreur CORS
- Vérifiez `CORS_ALLOWED_ORIGINS` dans `settings.py`
- Assurez-vous que `django-cors-headers` est dans `INSTALLED_APPS`

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs du terminal
2. Consultez la console du navigateur (F12)
3. Vérifiez que toutes les dépendances sont installées
4. Assurez-vous que PostgreSQL fonctionne

---

## 📄 Structure du projet

```
nourounmounirou-ecommerce/
│
├── backend/                    # Django Backend
│   ├── nourounmounirou/       # Configuration principale
│   │   ├── settings.py        # Paramètres Django
│   │   ├── urls.py            # URLs principales
│   │   └── wsgi.py
│   ├── products/              # App produits
│   │   ├── models.py          # Modèles de données
│   │   ├── views.py           # Vues API
│   │   ├── serializers.py     # Serializers
│   │   └── admin.py           # Interface admin
│   ├── authentication/        # App authentification
│   ├── manage.py
│   ├── requirements.txt       # Dépendances Python
│   └── .env                   # Variables d'environnement
│
└── frontend/                   # React Frontend
    ├── src/
    │   ├── components/        # Composants réutilisables
    │   ├── pages/             # Pages principales
    │   ├── services/          # Services API
    │   ├── context/           # Contextes React
    │   ├── App.jsx            # Composant principal
    │   └── main.jsx           # Point d'entrée
    ├── package.json           # Dépendances Node.js
    ├── vite.config.js         # Configuration Vite
    └── index.html
```

---

## 🎉 Félicitations !

Vous avez maintenant un site e-commerce complet et professionnel pour NourounMounirou !

Le site est :
- ✅ Simple à utiliser pour votre maman
- ✅ Moderne et responsive
- ✅ Déployable gratuitement
- ✅ Intégré avec WhatsApp
- ✅ Sécurisé avec authentification

Bonne vente ! 🛍️
