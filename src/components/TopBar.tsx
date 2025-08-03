import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  LogOut, 
  User,
  ArrowLeft
} from 'lucide-react';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  onMySessionsClick?: () => void;
  onLogout: () => void;
  currentPage?: 'dashboard' | 'sessions' | 'other';
}

const TopBar = ({ 
  title, 
  subtitle, 
  showBackButton = false, 
  onBack, 
  onMySessionsClick, 
  onLogout,
  currentPage = 'other'
}: TopBarProps) => {
  const psychologistInfo = {
    name: "Dra. Maria Silva",
    specialty: "Psicologia Clínica",
    photo: "/placeholder-photo.jpg"
  };

  return (
    <div className="bg-card/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      {/* Header com informações do psicólogo - sempre visível */}
      <div className="px-4 py-2 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={psychologistInfo.photo} alt={psychologistInfo.name} />
              <AvatarFallback className="bg-primary/10">
                <User className="w-4 h-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-inter font-semibold text-sm text-foreground">
                {psychologistInfo.name}
              </h3>
              <p className="font-inter text-xs text-muted-foreground">
                {psychologistInfo.specialty}
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="font-inter text-xs text-destructive hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Sair
          </Button>
        </div>
      </div>

      {/* Navegação */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          
          <div>
            {title && (
              <h2 className="font-inter font-semibold text-lg text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="font-inter text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {currentPage !== 'sessions' && onMySessionsClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMySessionsClick}
              className="font-inter text-xs"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Minhas Sessões
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;