from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    """Modèle pour les catégories de produits"""
    CATEGORY_CHOICES = [
        ('vaisselle', 'Vaisselle'),
        ('tissus', 'Tissus'),
        ('habits', 'Habits'),
        ('chaussures', 'Chaussures'),
        ('autres', 'Autres'),
    ]
    
    name = models.CharField(max_length=50, choices=CATEGORY_CHOICES, unique=True)
    display_name = models.CharField(max_length=100)
    emoji = models.CharField(max_length=10, default='📦')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'
        ordering = ['name']
    
    def __str__(self):
        return self.display_name


class Product(models.Model):
    """Modèle pour les produits"""
    name = models.CharField(max_length=200, verbose_name='Nom du produit')
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='products',
        verbose_name='Catégorie'
    )
    description = models.TextField(blank=True, verbose_name='Description')
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name='Prix (FCFA)'
    )
    emoji = models.CharField(max_length=10, default='📦', verbose_name='Emoji')
    image = models.ImageField(
        upload_to='products/', 
        null=True, 
        blank=True,
        verbose_name='Image'
    )
    is_available = models.BooleanField(default=True, verbose_name='Disponible')
    created_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='products'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Produit'
        verbose_name_plural = 'Produits'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class Settings(models.Model):
    """Modèle pour les paramètres du site"""
    whatsapp_number = models.CharField(
        max_length=20, 
        verbose_name='Numéro WhatsApp',
        help_text='Format: code pays + numéro (ex: 22890123456)'
    )
    store_name = models.CharField(
        max_length=200, 
        default='NourounMounirou',
        verbose_name='Nom de la boutique'
    )
    store_description = models.TextField(
        default='Votre boutique de confiance',
        verbose_name='Description'
    )
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Paramètre'
        verbose_name_plural = 'Paramètres'
    
    def __str__(self):
        return self.store_name
    
    def save(self, *args, **kwargs):
        # S'assurer qu'il n'y a qu'une seule instance de Settings
        if not self.pk and Settings.objects.exists():
            raise ValueError('Il ne peut y avoir qu\'une seule instance de Settings')
        return super().save(*args, **kwargs)
