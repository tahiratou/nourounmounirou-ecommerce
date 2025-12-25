from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, Settings
from .serializers import (
    ProductSerializer, 
    ProductListSerializer, 
    CategorySerializer,
    SettingsSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pour gérer les catégories (lecture seule pour les clients)
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les produits
    - Liste et détails : accessible à tous
    - Création, modification, suppression : admin uniquement
    """
    queryset = Product.objects.select_related('category', 'created_by').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_available']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'price', 'name']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Pour les non-admin, afficher uniquement les produits disponibles
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_available=True)
        
        return queryset
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def by_category(self, request):
        """Obtenir les produits par catégorie"""
        category_name = request.query_params.get('category', None)
        if category_name:
            products = self.get_queryset().filter(
                category__name=category_name,
                is_available=True
            )
            serializer = self.get_serializer(products, many=True)
            return Response(serializer.data)
        return Response({'error': 'Paramètre category requis'}, status=400)


class SettingsViewSet(viewsets.ViewSet):
    """
    ViewSet pour gérer les paramètres du site
    """
    
    def list(self, request):
        """Obtenir les paramètres (accessible à tous)"""
        try:
            settings = Settings.objects.first()
            if not settings:
                # Créer des paramètres par défaut si aucun n'existe
                settings = Settings.objects.create(
                    whatsapp_number='',
                    store_name='NourounMounirou',
                    store_description='Votre boutique de confiance'
                )
            serializer = SettingsSerializer(settings)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def update(self, request, pk=None):
        """Mettre à jour les paramètres (admin uniquement)"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentification requise'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            settings = Settings.objects.first()
            if not settings:
                settings = Settings.objects.create()
            
            serializer = SettingsSerializer(settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
