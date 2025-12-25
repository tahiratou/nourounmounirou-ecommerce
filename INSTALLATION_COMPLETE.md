# 📦 Installation Complète - NourounMounirou E-commerce

## 🎯 Ce que vous avez

Un site e-commerce professionnel avec :
- ✅ **Backend Django** avec API REST complète
- ✅ **Frontend React** moderne et responsive
- ✅ **Base de données PostgreSQL** (gratuite)
- ✅ **Authentification** sécurisée
- ✅ **Upload d'images**
- ✅ **Intégration WhatsApp**
- ✅ **Interface admin simple** pour votre maman

---

## 📋 ÉTAPE 1 : Installations préalables (à faire UNE SEULE FOIS)

### Windows

1. **Python 3.10+**
   - Télécharger : https://www.python.org/downloads/
   - ⚠️ COCHER "Add Python to PATH" pendant l'installation
   - Vérifier : ouvrir PowerShell et taper `python --version`

2. **Node.js 18+**
   - Télécharger : https://nodejs.org/ (version LTS)
   - Installer normalement
   - Vérifier : `node --version` et `npm --version`

3. **PostgreSQL**
   - Télécharger : https://www.postgresql.org/download/windows/
   - Installer avec Stack Builder
   - Noter le mot de passe que vous créez pour l'utilisateur "postgres"
   - Vérifier : `psql --version`

4. **Git** (optionnel mais recommandé)
   - Télécharger : https://git-scm.com/downloads

### macOS

```bash
# Installer Homebrew (si pas déjà installé)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer Python
brew install python@3.11

# Installer Node.js
brew install node

# Installer PostgreSQL
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu/Debian)

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Python
sudo apt install python3 python3-pip python3-venv -y

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Installer PostgreSQL
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## 📋 ÉTAPE 2 : Configuration de la base de données

### Créer la base de données PostgreSQL

**Windows (PowerShell) :**
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Dans psql, exécuter :
CREATE DATABASE nourounmounirou_db;
CREATE USER nouroun_user WITH PASSWORD 'Touba25,';
ALTER ROLE nouroun_user SET client_encoding TO 'utf8';
ALTER ROLE nouroun_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE nouroun_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE nourounmounirou_db TO nouroun_user;
\q
```

**macOS/Linux :**
```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Puis même commandes que Windows ci-dessus
```

**Votre DATABASE_URL sera :**
```
postgresql://nouroun_user:Touba25,@localhost:5432/nourounmounirou_db
```

---

## 📋 ÉTAPE 3 : Installation du Backend

### 3.1 Ouvrir un terminal

**Windows :** PowerShell ou Command Prompt  
**macOS/Linux :** Terminal

### 3.2 Naviguer vers le projet

```bash
cd chemin/vers/nourounmounirou-ecommerce/backend
```

### 3.3 Créer et activer l'environnement virtuel

**Windows :**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux :**
```bash
python3 -m venv venv
source venv/bin/activate
```

Vous devriez voir `(venv)` apparaître au début de votre ligne de commande.

### 3.4 Installer les dépendances

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

⏱️ Cela prend 2-3 minutes.

### 3.5 Configurer les variables d'environnement

Créez le fichier `.env` :

**Windows :**
```bash
copy .env.example .env
notepad .env
```

**macOS/Linux :**
```bash
cp .env.example .env
nano .env
```

Modifiez avec vos informations :

```env
DATABASE_URL=postgresql://nouroun_user:Touba25,@localhost:5432/nourounmounirou_db
SECRET_KEY=upo&)yvdh^t%#n%jbc5mt2vqqf3n8nxy^5sk2bp)1u7m9-7@92
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

**Pour générer une SECRET_KEY sécurisée :**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 3.6 Initialiser la base de données

```bash
# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate
```

### 3.7 Créer les catégories par défaut

```bash
python manage.py shell
```

Dans le shell Python qui s'ouvre, copiez-collez tout ce bloc :

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

print("✅ Catégories créées avec succès!")
exit()
```

### 3.8 Créer un compte administrateur

```bash
python manage.py createsuperuser
```

Remplissez :
- **Username** : admin (ou le prénom de votre maman)
- **Email** : (vous pouvez laisser vide ou mettre un email)
- **Password** : Choisissez un mot de passe sécurisé (min 8 caractères)

### 3.9 Lancer le serveur backend

```bash
python manage.py runserver
```

✅ **Le backend est maintenant accessible sur : http://localhost:8000**

Testez en ouvrant : http://localhost:8000/admin  
Vous devriez voir l'interface d'administration Django.

⚠️ **NE FERMEZ PAS CE TERMINAL** - Laissez le serveur tourner.

---

## 📋 ÉTAPE 4 : Installation du Frontend

### 4.1 Ouvrir un NOUVEAU terminal

⚠️ Laissez le terminal du backend ouvert, ouvrez-en un nouveau.

### 4.2 Naviguer vers le frontend

```bash
cd chemin/vers/nourounmounirou-ecommerce/frontend
```

### 4.3 Installer les dépendances Node.js

```bash
npm install
```

⏱️ Cela prend 3-5 minutes la première fois.

### 4.4 Lancer le serveur de développement

```bash
npm run dev
```

✅ **Le frontend est maintenant accessible sur : http://localhost:5173**

---

## 🎉 ÉTAPE 5 : Premier test complet

### 5.1 Vérifications

Vous devriez avoir :
- ✅ Terminal 1 : Backend Django sur http://localhost:8000
- ✅ Terminal 2 : Frontend React sur http://localhost:5173

### 5.2 Test de la boutique

1. Ouvrez votre navigateur sur http://localhost:5173
2. Vous devriez voir la page d'accueil de NourounMounirou
3. Cliquez sur "Connexion" (ou "Admin" en haut à droite)

### 5.3 Test de l'interface admin

1. Entrez les identifiants créés à l'étape 3.8
2. Vous devriez être redirigé vers le panneau d'administration
3. Vous verrez 3 onglets :
   - **Mes Produits** : Pour gérer les produits
   - **Ajouter un produit** : Pour ajouter de nouveaux produits
   - **Paramètres** : Pour configurer WhatsApp

### 5.4 Ajouter un produit test

1. Allez dans l'onglet "Ajouter un produit"
2. Remplissez :
   - Nom : "Test Assiette"
   - Catégorie : Vaisselle
   - Description : "Assiette de test"
   - Prix : 5000
   - Emoji : 🍽️
3. Cliquez sur "Ajouter le produit"
4. Retournez à l'accueil (cliquez sur "Boutique")
5. Vous devriez voir votre produit !

### 5.5 Configurer WhatsApp

1. Retournez dans l'admin
2. Onglet "Paramètres"
3. Entrez le numéro WhatsApp de votre maman (format : 22890123456)
4. Cliquez sur "Enregistrer"

---

## 🚀 Utilisation Quotidienne

### Démarrer le site

**Terminal 1 - Backend :**
```bash
cd backend
venv\Scripts\activate              # Windows
# source venv/bin/activate         # macOS/Linux
python manage.py runserver
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

### Arrêter le site

Dans chaque terminal, appuyez sur `Ctrl + C`

---

## 🌐 Déploiement GRATUIT sur Internet

### Option : Render.com (Recommandé)

1. **Créer un compte gratuit** sur https://render.com

2. **Créer la base de données** :
   - Dashboard → New → PostgreSQL
   - Name : nourounmounirou-db
   - Gratuit (Free tier)
   - Copiez l'URL "Internal Database URL"

3. **Déployer le backend** :
   - Dashboard → New → Web Service
   - Connect GitHub repository
   - Name : nourounmounirou-api
   - Environment : Python 3
   - Build Command : `./build.sh`
   - Start Command : `gunicorn nourounmounirou.wsgi:application`
   - Variables d'environnement :
     ```
     DATABASE_URL=<l'URL copiée à l'étape 2>
     SECRET_KEY=<générer une nouvelle clé secrète>
     DEBUG=False
     ALLOWED_HOSTS=.onrender.com
     ```

4. **Déployer le frontend** :
   - Dashboard → New → Static Site
   - Connect GitHub repository
   - Build Command : `cd frontend && npm install && npm run build`
   - Publish Directory : `frontend/dist`

5. **Mettre à jour l'URL API** dans `frontend/src/services/api.js` :
   ```javascript
   const API_URL = 'https://votre-app.onrender.com/api';
   ```

---

## 🐛 Résolution de Problèmes

### "python n'est pas reconnu"
→ Python n'est pas dans le PATH. Réinstallez en cochant "Add to PATH"

### "command not found: npm"
→ Node.js n'est pas installé correctement. Réinstallez.

### "connection refused" sur PostgreSQL
→ Vérifiez que PostgreSQL tourne : `pg_isready`

### Le frontend ne se connecte pas au backend
→ Vérifiez que le backend tourne sur le port 8000
→ Ouvrez F12 dans le navigateur pour voir les erreurs

### "ModuleNotFoundError: No module named 'django'"
→ Activez l'environnement virtuel : `venv\Scripts\activate`

### Images ne s'affichent pas
→ Créez le dossier `backend/media/products/` manuellement

---

## 📞 Support

Si vous avez des questions :
1. Vérifiez les logs dans les terminaux
2. Ouvrez la console du navigateur (F12)
3. Consultez README.md pour plus de détails

---

## ✅ Checklist Finale

- [ ] Python, Node.js et PostgreSQL installés
- [ ] Base de données créée
- [ ] Backend installé et qui tourne
- [ ] Frontend installé et qui tourne
- [ ] Compte admin créé
- [ ] Connexion réussie dans l'interface admin
- [ ] Produit de test ajouté
- [ ] WhatsApp configuré
- [ ] Site accessible depuis http://localhost:5173

🎉 **Félicitations ! Le site de NourounMounirou est opérationnel !**
