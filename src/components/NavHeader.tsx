import React, { useState } from 'react';
import { User, Settings, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const NavHeader: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);

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
      <div className="relative flex items-center gap-3">
        <Button
          variant="ghost"
          className="flex items-center gap-3 h-auto p-2 hover:bg-accent/10"
          onClick={() => setShowProfile(!showProfile)}
        >
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Dr. Priya Sharma</p>
            <p className="text-xs text-muted-foreground">Research Scientist, NATPAC</p>
          </div>
          <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-200">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
              PS
            </AvatarFallback>
          </Avatar>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
        </Button>

        {/* Profile Dropdown */}
        {showProfile && (
          <Card className="absolute top-full right-0 mt-2 w-80 z-50 shadow-lg yatrachain-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                    PS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">Dr. Priya Sharma</p>
                  <p className="text-sm text-muted-foreground">Research Scientist</p>
                  <p className="text-sm text-muted-foreground">NATPAC</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-foreground">priya.sharma@natpac.gov.in</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="text-foreground">+91 9876543210</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employee ID:</span>
                  <span className="text-foreground">NATPAC-2024-001</span>
                </div>
              </div>

              <div className="border-t pt-3 mt-3">
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </header>
  );
};

export default NavHeader;