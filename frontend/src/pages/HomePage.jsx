import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';
import { productService, categoryService, settingsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes, settingsRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        settingsService.get(),
      ]);
      setProducts(productsRes.data.results || productsRes.data);
      setCategories(categoriesRes.data.results || categoriesRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'tous') {
      filtered = filtered.filter(p => p.category === parseInt(selectedCategory));
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredProducts = filterProducts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-red-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-900 mx-auto"></div>
          <p className="text-lg text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50">
      {/* Header avec les couleurs du logo */}
      <header className="bg-gradient-to-r from-amber-500 via-red-900 to-red-950 text-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Logo à gauche */}
            <div className="flex items-center gap-4">
              <div className="w-40 h-16 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/logo.jpg" 
                  alt="Logo NourounMounirou" 
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center text-2xl font-bold text-red-900">
                  NM
                </div>
              </div>
            </div>

            {/* Nom et description à droite */}
            <div className="text-right">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {settings?.store_name || 'NourounMounirou'}
              </h1>
              <p className="text-amber-100 text-sm">
                {settings?.store_description || 'Votre boutique de confiance'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Barre de recherche */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg border-2 border-gray-300 focus:border-red-900"
            />
          </div>
        </div>

        <Separator className="my-8" />

        {/* Catégories */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Catégories</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === 'tous' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('tous')}
              className={selectedCategory === 'tous' 
                ? 'bg-red-900 hover:bg-red-800' 
                : 'border-2 border-gray-300 hover:border-red-900 hover:bg-red-50'}
              size="lg"
            >
              Tous les produits
            </Button>
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id.toString() ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={selectedCategory === cat.id.toString()
                  ? 'bg-red-900 hover:bg-red-800'
                  : 'border-2 border-gray-300 hover:border-red-900 hover:bg-red-50'}
                size="lg"
              >
                <span className="mr-2">{cat.emoji}</span>
                {cat.display_name}
                <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-900">
                  {cat.products_count || 0}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Grille de produits */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-100 to-red-100 flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-red-900" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-gray-900">Aucun produit trouvé</h3>
              <p className="text-lg text-gray-600">
                {searchTerm 
                  ? 'Essayez une autre recherche ou changez de catégorie' 
                  : 'Les produits seront bientôt disponibles'}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  whatsappNumber={settings?.whatsapp_number}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-red-950 to-red-900 text-white mt-20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold">
            © {settings?.store_name || 'NourounMounirou'} - Tous droits réservés
          </p>
          <p className="text-amber-200 mt-2">
            Votre boutique de confiance en ligne
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;