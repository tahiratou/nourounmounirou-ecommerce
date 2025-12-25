from django.contrib import admin
from .models import Product, Category, Settings


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'display_name', 'emoji', 'created_at']
    search_fields = ['name', 'display_name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'is_available', 'created_by', 'created_at']
    list_filter = ['category', 'is_available', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('name', 'category', 'description', 'emoji')
        }),
        ('Prix et disponibilité', {
            'fields': ('price', 'is_available')
        }),
        ('Image', {
            'fields': ('image',)
        }),
        ('Métadonnées', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # Si c'est une nouvelle création
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Settings)
class SettingsAdmin(admin.ModelAdmin):
    list_display = ['store_name', 'whatsapp_number', 'updated_at']
    
    def has_add_permission(self, request):
        # Empêcher la création de plus d'une instance
        return not Settings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Empêcher la suppression
        return False
