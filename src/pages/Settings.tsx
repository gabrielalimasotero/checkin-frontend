import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Globe, Lock, Eye, EyeOff, Users, UserCheck, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PrivacySettings {
  defaultCheckInVisibility: 'public' | 'private';
  showReviewsInFeed: boolean;
  isConnectable: boolean;
  defaultPostVisibility: 'public' | 'friends';
  showLocation: boolean;
  allowFriendRequests: boolean;
  showOnlineStatus: boolean;
}

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    defaultCheckInVisibility: 'public',
    showReviewsInFeed: true,
    isConnectable: true,
    defaultPostVisibility: 'public',
    showLocation: true,
    allowFriendRequests: true,
    showOnlineStatus: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // TODO: Implementar API para carregar configurações do usuário
        // const data = await getUserPrivacySettings();
        // setSettings(data);
        console.log('Carregando configurações de privacidade...');
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadSettings();
    }
  }, [user?.id]);

  const updateSetting = async (key: keyof PrivacySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      setIsSaving(true);
      // Implementar API para salvar configurações
      // await updateUserPrivacySettings({ [key]: value });
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      // Reverter mudança em caso de erro
      setSettings(settings);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVisibilityToggle = (type: 'checkIn' | 'post') => {
    if (type === 'checkIn') {
      const newValue = settings.defaultCheckInVisibility === 'public' ? 'private' : 'public';
      updateSetting('defaultCheckInVisibility', newValue);
    } else {
      const newValue = settings.defaultPostVisibility === 'public' ? 'friends' : 'public';
      updateSetting('defaultPostVisibility', newValue);
    }
  };

  if (isLoading) {
    return (
      <div className="mobile-viewport bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="mobile-viewport bg-background flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-bold text-primary">Configurações de Privacidade</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        
        {/* Check-ins */}
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Check-ins</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">Visibilidade padrão</div>
                <div className="text-sm text-muted-foreground">
                  Como seus check-ins aparecem por padrão
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVisibilityToggle('checkIn')}
                className="ml-3"
              >
                {settings.defaultCheckInVisibility === 'public' ? (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Público
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Privado
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">Mostrar localização</div>
                <div className="text-sm text-muted-foreground">
                  Permitir que outros vejam sua localização atual
                </div>
              </div>
              <Switch
                checked={settings.showLocation}
                onCheckedChange={(checked) => updateSetting('showLocation', checked)}
                disabled={isSaving}
              />
            </div>
          </div>
        </Card>

        {/* Posts e Avaliações */}
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Posts e Avaliações</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">Visibilidade dos posts</div>
                <div className="text-sm text-muted-foreground">
                  Quem pode ver seus posts por padrão
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVisibilityToggle('post')}
                className="ml-3"
              >
                {settings.defaultPostVisibility === 'public' ? (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Todos
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Amigos
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">Mostrar avaliações no feed</div>
                <div className="text-sm text-muted-foreground">
                  Suas avaliações aparecerão no feed dos amigos
                </div>
              </div>
              <Switch
                checked={settings.showReviewsInFeed}
                onCheckedChange={(checked) => updateSetting('showReviewsInFeed', checked)}
                disabled={isSaving}
              />
            </div>
          </div>
        </Card>

        {/* Conexões */}
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <UserCheck className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Conexões</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium flex items-center space-x-2">
                  <span>Conectável</span>
                  {settings.isConnectable && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Ativo
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Permite que pessoas próximas te encontrem e conectem
                </div>
              </div>
              <Switch
                checked={settings.isConnectable}
                onCheckedChange={(checked) => updateSetting('isConnectable', checked)}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">Aceitar solicitações de amizade</div>
                <div className="text-sm text-muted-foreground">
                  Permitir que outros enviem solicitações de amizade
                </div>
              </div>
              <Switch
                checked={settings.allowFriendRequests}
                onCheckedChange={(checked) => updateSetting('allowFriendRequests', checked)}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">Mostrar status online</div>
                <div className="text-sm text-muted-foreground">
                  Outros podem ver quando você está online
                </div>
              </div>
              <Switch
                checked={settings.showOnlineStatus}
                onCheckedChange={(checked) => updateSetting('showOnlineStatus', checked)}
                disabled={isSaving}
              />
            </div>
          </div>
        </Card>

        {/* Resumo das Configurações */}
        <Card className="p-4 bg-muted/50">
          <h3 className="font-semibold mb-3 text-muted-foreground">Resumo das suas configurações</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Check-ins:</span>
              <span className="font-medium">
                {settings.defaultCheckInVisibility === 'public' ? 'Públicos' : 'Privados'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Posts:</span>
              <span className="font-medium">
                {settings.defaultPostVisibility === 'public' ? 'Para todos' : 'Só amigos'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Conectável:</span>
              <span className="font-medium">
                {settings.isConnectable ? 'Sim' : 'Não'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Avaliações no feed:</span>
              <span className="font-medium">
                {settings.showReviewsInFeed ? 'Sim' : 'Não'}
              </span>
            </div>
          </div>
        </Card>

        {isSaving && (
          <div className="text-center text-sm text-muted-foreground py-2">
            Salvando alterações...
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
