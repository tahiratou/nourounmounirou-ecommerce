import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User as UserIcon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 via-red-900 to-red-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-red-900 bg-clip-text text-transparent">
              NM
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">NourounMounirou</h1>
            <p className="text-amber-200 text-lg">Connexion Administrateur</p>
          </div>
        </div>

        {/* Carte de connexion */}
        <Card className="border-2 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">Bienvenue</CardTitle>
            <CardDescription className="text-center text-white">
              Connectez-vous pour gérer votre boutique
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-white">
                  <UserIcon className="h-4 w-4" />
                  Nom d'utilisateur
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre nom d'utilisateur"
                  required
                  disabled={loading}
                  className="h-12 text-white placeholder:text-white"
                />
              </div>

              <div className="space-y-2">

                <label className="text-sm font-medium flex items-center gap-2 text-white">
                  <Lock className="h-4 w-4" />
                  Mot de passe
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  required
                  disabled={loading}
                  className="h-12 text-white placeholder:text-white "
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-red-900 hover:from-amber-600 hover:to-red-800 text-white font-semibold text-lg"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <Button 
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-white hover:text-red-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la boutique
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information */}
        <div className="text-center text-white text-sm bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p className="font-medium">Accès réservé aux administrateurs</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;