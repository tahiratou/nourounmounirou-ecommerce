import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Package, Plus, Settings as SettingsIcon, Trash2, Edit, LogOut } from 'lucide-react';
import { productService, categoryService, settingsService, authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

function AdminPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // States pour les données
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States pour les messages d'erreur et succès
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // States pour l'édition
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // State pour le formulaire
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
    emoji: '',
    is_available: true,
  });

  // useEffect pour charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await loadProducts();
      await loadCategories();
      await loadSettings();
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await settingsService.get();
      setSettings(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Forcer l'obtention du CSRF token avant l'upload
      await authService.getCsrfToken();
      
      // Petit délai pour s'assurer que le cookie est bien défini
      await new Promise(resolve => setTimeout(resolve, 100));

      const formData = new FormData();
      formData.append('name', formValues.name);
      formData.append('description', formValues.description);
      formData.append('price', formValues.price);
      formData.append('category', formValues.category);
      formData.append('emoji', formValues.emoji);
      formData.append('is_available', formValues.is_available);
      
      if (formValues.image) {
        formData.append('image', formValues.image);
      }

      let response;
      if (editingProduct) {
        response = await productService.update(editingProduct.id, formData);
        setSuccess('Produit modifié avec succès!');
      } else {
        response = await productService.create(formData);
        setSuccess('Produit ajouté avec succès!');
      }

      // Réinitialiser le formulaire
      setFormValues({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null,
        emoji: '',
        is_available: true,
      });
      setImagePreview(null);
      setEditingProduct(null);

      // Recharger les produits
      await loadProducts();
      
      // Changer d'onglet après succès
      setActiveTab('products');
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.response?.data?.detail || 'Erreur lors de l\'ajout du produit');
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      return;
    }

    try {
      await productService.delete(id);
      showMessage('Produit supprimé avec succès');
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('Erreur lors de la suppression', 'error');
    }
  };

  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    const formElement = e.target;
    const whatsappNumber = formElement.whatsapp_number.value;

    try {
      await settingsService.update({ whatsapp_number: whatsappNumber });
      showMessage('Paramètres mis à jour avec succès');
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('Erreur lors de la mise à jour', 'error');
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('fr-FR');
  };

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
      {/* Header Admin */}
      <header className="bg-gradient-to-r from-amber-500 via-red-900 to-red-950 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Store className="h-8 w-8 text-red-900" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Panneau d'administration</h1>
                <p className="text-amber-200">Bienvenue, {user?.username}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="secondary"
                onClick={() => navigate('/')}
                className="bg-white text-red-900 hover:bg-amber-100"
              >
                <Home className="mr-2 h-5 w-5" />
                Boutique
              </Button>
              <Button 
                variant="destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Messages */}
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-6">
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid h-auto bg-white border-2 p-1">
            <TabsTrigger 
              value="products" 
              className="data-[state=active]:bg-red-900 data-[state=active]:text-white py-3 px-6"
            >
              <Package className="mr-2 h-5 w-5" />
              Mes Produits ({products.length})
            </TabsTrigger>
            <TabsTrigger 
              value="add"
              className="data-[state=active]:bg-red-900 data-[state=active]:text-white py-3 px-6"
            >
              <Plus className="mr-2 h-5 w-5" />
              Ajouter
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-red-900 data-[state=active]:text-white py-3 px-6"
            >
              <SettingsIcon className="mr-2 h-5 w-5" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Onglet Produits */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Mes Produits</CardTitle>
                <CardDescription>Gérez tous vos produits en vente</CardDescription>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-16 space-y-6">
                    <div className="flex justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-red-100 flex items-center justify-center">
                        <Package className="h-12 w-12 text-red-900" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900">Aucun produit</h3>
                      <p className="text-gray-600">Commencez par ajouter votre premier produit</p>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('add')}
                      className="bg-red-900 hover:bg-red-800"
                      size="lg"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Ajouter un produit
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map(product => (
                      <Card key={product.id} className="border-2 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex gap-6 items-center">
                            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-amber-50 to-red-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-4xl">{product.emoji}</div>
                              )}
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                                <Badge className="bg-amber-100 text-amber-900">
                                  {product.category_emoji} {product.category_name}
                                </Badge>
                              </div>
                              <p className="text-gray-600 line-clamp-2">
                                {product.description || 'Aucune description'}
                              </p>
                              <p className="text-2xl font-bold text-red-900">
                                {formatPrice(product.price)} FCFA
                              </p>
                            </div>
                            
                            <Button 
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(product.id)}
                              className="flex-shrink-0"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Ajouter - Suite dans le prochain fichier */}
          <TabsContent value="add" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Ajouter un nouveau produit</CardTitle>
                <CardDescription>Remplissez les informations du produit</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Nom du produit *</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ex: Assiette en céramique"
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Catégorie *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full h-12 px-3 border-2 border-gray-300 rounded-md focus:border-red-900 focus:outline-none"
                    >
                      <option value="">Choisir une catégorie</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.emoji} {cat.display_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Description</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Décrivez votre produit..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Prix (FCFA) *</label>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Ex: 5000"
                      min="0"
                      step="0.01"
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Emoji du produit</label>
                    <Input
                      type="text"
                      name="emoji"
                      value={formData.emoji}
                      onChange={handleInputChange}
                      placeholder="Ex: 🍽️"
                      maxLength="10"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Image du produit
                    </label>
                    <Input
                      type="file"
                      id="productImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="h-12 cursor-pointer"
                    />
                    <p className="text-sm text-gray-500">Format: JPG, PNG, GIF (max 5MB)</p>
                  </div>

                  <Separator />

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg bg-red-900 hover:bg-red-800"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Ajouter le produit
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Paramètres */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Paramètres WhatsApp</CardTitle>
                <CardDescription>Configurez le numéro WhatsApp pour les commandes</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSettingsUpdate} className="space-y-6 max-w-2xl">
                  <div className="space-y-2 bg-green-50 p-6 rounded-lg border-2 border-green-200">
                    <label className="text-sm font-semibold text-green-900">
                      Numéro WhatsApp (avec indicatif pays) *
                    </label>
                    <Input
                      type="text"
                      name="whatsapp_number"
                      defaultValue={settings?.whatsapp_number || ''}
                      placeholder="Ex: 22890123456"
                      required
                      className="h-12 bg-white"
                    />
                    <p className="text-sm text-green-700">
                      Format: code pays + numéro (sans +, espaces ou tirets)
                      <br />
                      Exemple: 22890123456 pour un numéro du Bénin
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
                  >
                    Enregistrer les paramètres
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminPage;
