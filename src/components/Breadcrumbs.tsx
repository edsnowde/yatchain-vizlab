import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const breadcrumbMap: { [key: string]: string } = {
  '/': 'Dashboard',
  '/users': 'Users',
  '/analytics': 'Analytics',
  '/export': 'Export',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Special handling for dynamic routes
  const getBreadcrumbName = (path: string, index: number) => {
    if (breadcrumbMap[path]) {
      return breadcrumbMap[path];
    }
    
    // Handle user ID in path
    if (pathSegments[index - 1] === 'users' && /^\d+$/.test(pathSegments[index])) {
      return `User #${pathSegments[index]}`;
    }
    
    // Handle trip ID in path
    if (pathSegments[index - 1] === 'trips' && /^\d+$/.test(pathSegments[index])) {
      return `Trip #${pathSegments[index]}`;
    }
    
    return pathSegments[index];
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {pathSegments.length > 0 && location.pathname !== '/' && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            {pathSegments.map((segment, index) => {
              const path = '/' + pathSegments.slice(0, index + 1).join('/');
              const isLast = index === pathSegments.length - 1;
              const name = getBreadcrumbName(segment, index);
              
              return (
                <React.Fragment key={path}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={path}>{name}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                  )}
                </React.Fragment>
              );
            })}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;