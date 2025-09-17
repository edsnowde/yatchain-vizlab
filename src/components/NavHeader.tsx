import React from 'react';
import { MapPin, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const NavHeader: React.FC = () => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      {/* Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-primary rounded-xl shadow-card">
          <MapPin className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">YatraChain Scientist Dashboard</h1>
          <p className="text-sm text-muted-foreground">Transportation Analytics Platform</p>
        </div>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">Dr. Researcher</p>
          <p className="text-xs text-muted-foreground">Transportation Analyst</p>
        </div>
        <Avatar className="h-9 w-9 border-2 border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default NavHeader;