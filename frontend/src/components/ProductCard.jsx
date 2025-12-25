import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function ProductCard({ product, whatsappNumber }) {
  const handleWhatsAppClick = () => {
    if (!whatsappNumber) {
      alert('Le numéro WhatsApp n\'est pas configuré');
      return;
    }
    
    const message = `Bonjour, je suis intéressé(e) par: ${product.name} (${formatPrice(product.price)} FCFA)`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('fr-FR');
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
      <CardHeader className="p-0">
        <div className="relative w-full h-56 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-7xl">
              {product.emoji || '📦'}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <Badge variant="secondary" className="bg-amber-100 text-amber-900 hover:bg-amber-200">
          {product.category_emoji} {product.category_name}
        </Badge>
        
        <h3 className="font-bold text-xl text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-red-900">
            {formatPrice(product.price)}
          </span>
          <span className="text-lg text-gray-600">FCFA</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleWhatsAppClick}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
          size="lg"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Commander sur WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;