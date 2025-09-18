import React from 'react';
import { User, Settings } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const NavHeader: React.FC = () => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      {/* Logo and Title */}
      <div className="flex items-center gap-4">
        <img 
          src="/assets/yatrachain-logo.png" 
          alt="YatraChain" 
          className="h-10 w-auto yatrachain-logo"
        />
        <div>
          <h1 className="text-xl font-bold text-foreground">YatraChain Scientist Portal</h1>
          <p className="text-sm text-muted-foreground">Intelligent Journeys, Connected Data</p>
        </div>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">Dr. Priya Sharma</p>
          <p className="text-xs text-muted-foreground">Research Scientist, NATPAC</p>
        </div>
        <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-200">
          <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
            PS
          </AvatarFallback>
        </Avatar>
        <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-200" />
      </div>
    </header>
  );
};

export default NavHeader;