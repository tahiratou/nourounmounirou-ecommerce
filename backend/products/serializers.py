from rest_framework import serializers
from .models import Product, Category, Settings
from django.contrib.auth.models import User


class CategorySerializer(serializers.ModelSerializer):
    """Serializer pour les catégories"""
    products_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'display_name', 'emoji', 'products_count', 'created_at']
    
    def get_products_count(self, obj):
        return obj.products.filter(is_available=True).count()


class ProductSerializer(serializers.ModelSerializer):
    """Serializer pour les produits"""
    category_name = serializers.CharField(source='category.display_name', read_only=True)
    category_emoji = serializers.CharField(source='category.emoji', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'category_name', 'category_emoji',
            'description', 'price', 'emoji', 'image', 'is_available',
            'created_by', 'created_by_username', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
    
    def get_image_url(self, obj):
        """Retourne l'URL complète de l'image Cloudinary"""
        if obj.image:
            # Si CloudinaryField
            if hasattr(obj.image, 'url'):
                return obj.image.url
            # Si ImageField avec Cloudinary storage
            return obj.image.url if obj.image else None
        return None


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des produits"""
    category_name = serializers.CharField(source='category.display_name', read_only=True)
    category_emoji = serializers.CharField(source='category.emoji', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'category_name', 'category_emoji',
            'description', 'price', 'emoji', 'image', 'is_available', 'created_at'
        ]


class SettingsSerializer(serializers.ModelSerializer):
    """Serializer pour les paramètres"""
    
    class Meta:
        model = Settings
        fields = ['id', 'whatsapp_number', 'store_name', 'store_description', 'updated_at']
