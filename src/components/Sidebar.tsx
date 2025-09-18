import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  BarChart3, 
  Users, 
  FileDown,
  LogOut,
  Activity,
  User
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: Activity },
  { name: 'Export', href: '/export', icon: FileDown },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <img 
          src="/assets/yatrachain-logo.png" 
          alt="YatraChain" 
          className="h-8 w-auto yatrachain-logo"
        />
        <div className="ml-3">
          <h1 className="text-lg font-bold text-foreground">YatraChain</h1>
          <p className="text-sm text-muted-foreground">Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Scientist Profile */}
      <div className="border-t p-4 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-card border border-border">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold text-sm">
              PS
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Dr. Priya Sharma</p>
            <p className="text-xs text-muted-foreground truncate">Research Scientist</p>
            <p className="text-xs text-muted-foreground truncate">NATPAC</p>
          </div>
        </div>

        {/* Logout */}
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;