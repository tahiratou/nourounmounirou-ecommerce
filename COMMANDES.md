# 🎯 Commandes Essentielles - NourounMounirou

## 📦 Installation Initiale (Une seule fois)

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate              # Windows
# source venv/bin/activate         # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
# Éditez .env avec vos informations
python manage.py migrate
python manage.py createsuperuser
```

### Frontend
```bash
cd frontend
npm install
```

---

## 🚀 Démarrage Quotidien

### Terminal 1 - Backend
```bash
cd backend
venv\Scripts\activate              # Windows
# source venv/bin/activate         # macOS/Linux
python manage.py runserver
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

**URLs :**
- Frontend : http://localhost:5173
- Backend API : http://localhost:8000
- Admin Django : http://localhost:8000/admin

---

## 🛠️ Commandes Utiles

### Backend (Django)

```bash
# Créer des migrations après modification des models
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superuser
python manage.py createsuperuser

# Collecter les fichiers statiques (production)
python manage.py collectstatic

# Shell Django (pour tests)
python manage.py shell

# Vérifier les erreurs
python manage.py check

# Voir toutes les URLs disponibles
python manage.py show_urls
```

### Frontend (React)

```bash
# Lancer en développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview

# Installer une nouvelle dépendance
npm install nom-du-package
```

### Base de Données

```bash
# Se connecter à PostgreSQL
psql -U nouroun_user -d nourounmounirou_db

# Lister les tables
\dt

# Voir les données d'une table
SELECT * FROM products_product;

# Quitter
\q
```

---

## 🔧 Maintenance

### Ajouter une catégorie manuellement

```bash
python manage.py shell
```

```python
from products.models import Category
Category.objects.create(
    name='nouvelle_categorie',
    display_name='Nouvelle Catégorie',
    emoji='🎁'
)
exit()
```

### Supprimer tous les produits (ATTENTION)

```bash
python manage.py shell
```

```python
from products.models import Product
Product.objects.all().delete()
exit()
```

### Réinitialiser le mot de passe admin

```bash
python manage.py changepassword nom_utilisateur
```

### Backup de la base de données

```bash
# Exporter
pg_dump -U nouroun_user nourounmounirou_db > backup.sql

# Importer
psql -U nouroun_user nourounmounirou_db < backup.sql
```

---

## 🐛 Dépannage

### Erreur de port déjà utilisé (backend)

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <numero_pid> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

### Erreur de port déjà utilisé (frontend)

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <numero_pid> /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9
```

### Réinstaller les dépendances (frontend)

```bash
rm -rf node_modules package-lock.json
npm install
```

### Réinstaller les dépendances (backend)

```bash
pip install --force-reinstall -r requirements.txt
```

### Réinitialiser la base de données (ATTENTION : perte de données)

```bash
python manage.py flush
python manage.py migrate
python manage.py createsuperuser
```

---

## 📊 Commandes de Production

### Build et Test

```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend
cd backend
python manage.py check --deploy
python manage.py collectstatic --no-input
```

### Variables d'environnement de production

```env
# .env de production
DEBUG=False
ALLOWED_HOSTS=votre-domaine.com,www.votre-domaine.com
DATABASE_URL=postgresql://user:pass@host:5432/db
SECRET_KEY=<longue-cle-tres-securisee>
```

---

## 🔐 Sécurité

### Générer une nouvelle SECRET_KEY

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Changer le mot de passe WhatsApp (via API)

```bash
# Dans le shell Django
python manage.py shell
```

```python
from products.models import Settings
settings = Settings.objects.first()
settings.whatsapp_number = "22890123456"
settings.save()
exit()
```

---

## 📝 Logs et Debug

### Voir les logs en temps réel (production)

```bash
# Sur Render
# Dashboard → Service → Logs

# En local
tail -f backend/logs/django.log  # Si configuré
```

### Activer le mode debug temporairement

Dans `backend/nourounmounirou/settings.py` :
```python
DEBUG = True  # Temporairement pour voir les erreurs
```

⚠️ **N'oubliez pas de remettre à False en production !**

---

## 🎨 Personnalisation

### Changer le nom de la boutique

Dans l'interface admin → Paramètres → Nom de la boutique

Ou via shell :
```python
from products.models import Settings
settings = Settings.objects.first()
settings.store_name = "Nouveau Nom"
settings.store_description = "Nouvelle description"
settings.save()
```

### Modifier les couleurs du site

Éditez `frontend/src/index.css` :
```css
:root {
  --primary-color: #667eea;      /* Couleur principale */
  --secondary-color: #764ba2;    /* Couleur secondaire */
  --success-color: #25D366;      /* Vert WhatsApp */
}
```

---

## 📱 URLs Importantes

### En développement
- Site principal : http://localhost:5173
- Admin Django : http://localhost:8000/admin
- API produits : http://localhost:8000/api/products/products/
- API catégories : http://localhost:8000/api/products/categories/

### En production
- Site principal : https://votre-site.com
- Admin Django : https://votre-api.com/admin
- API : https://votre-api.com/api/

---

## ✅ Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] DEBUG=False en production
- [ ] SECRET_KEY changée
- [ ] Base de données de production créée
- [ ] Migrations appliquées
- [ ] Fichiers statiques collectés
- [ ] CORS configuré avec les bons domaines
- [ ] ALLOWED_HOSTS configuré
- [ ] Compte superuser créé
- [ ] Catégories créées
- [ ] WhatsApp configuré
- [ ] Tests effectués

---

🎉 **Le site est prêt à être utilisé !**
