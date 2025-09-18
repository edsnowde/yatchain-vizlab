import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, User, Save, Edit, Phone, Mail } from 'lucide-react';

// Mock user data
const mockUsers = [
  {
    id: 'U001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91 9876543210',
    category: 'Worker',
    tripCount: 245,
    lastActive: '2024-09-17',
    avgDistance: 12.5,
    favoriteMode: 'Bus',
  },
  {
    id: 'U002',
    name: 'Priya Nair',
    email: 'priya.nair@example.com', 
    phone: '+91 9876543211',
    category: 'Student',
    tripCount: 189,
    lastActive: '2024-09-16',
    avgDistance: 8.3,
    favoriteMode: 'Metro',
  },
  {
    id: 'U003',
    name: 'John Thomas',
    email: 'john.thomas@example.com',
    phone: '+91 9876543212',
    category: 'Tourist',
    tripCount: 76,
    lastActive: '2024-09-15',
    avgDistance: 25.1,
    favoriteMode: 'Train',
  },
  {
    id: 'U004',
    name: 'Sarah Abraham',
    email: 'sarah.abraham@example.com',
    phone: '+91 9876543213',
    category: 'Worker',
    tripCount: 312,
    lastActive: '2024-09-17',
    avgDistance: 15.7,
    favoriteMode: 'Two-Wheeler',
  },
  {
    id: 'U005',
    name: 'Mohammed Ali',
    email: 'mohammed.ali@example.com',
    phone: '+91 9876543214',
    category: 'Student',
    tripCount: 134,
    lastActive: '2024-09-17',
    avgDistance: 6.2,
    favoriteMode: 'Walk',
  },
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>('U001');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const filteredUsers = mockUsers.filter(user =>
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}/trips`);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Worker': return 'bg-blue-100 text-blue-800';
      case 'Student': return 'bg-green-100 text-green-800';
      case 'Tourist': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedUserData = selectedUser ? mockUsers.find(u => u.id === selectedUser) : null;

  const handleSaveDetails = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleUserDetailsChange = (field: string, value: string) => {
    if (selectedUserData) {
      // In a real app, this would update the backend
      const userIndex = mockUsers.findIndex(u => u.id === selectedUser);
      if (userIndex !== -1) {
        (mockUsers[userIndex] as any)[field] = value;
      }
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Users</h1>
            <Breadcrumbs />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* User Details Panel */}
        <div className="w-80 border-r p-6 bg-card">
          <Card className="yatrachain-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  User Details
                </div>
                {selectedUserData && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="yatrachain-button"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedUserData ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">Name</Label>
                    <Input
                      id="name"
                      value={selectedUserData.name}
                      onChange={(e) => handleUserDetailsChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 transition-all duration-200 focus:shadow-focus"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={selectedUserData.email}
                      onChange={(e) => handleUserDetailsChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 transition-all duration-200 focus:shadow-focus"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={selectedUserData.phone}
                      onChange={(e) => handleUserDetailsChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 transition-all duration-200 focus:shadow-focus"
                    />
                  </div>

                  {isEditing && (
                    <Button
                      onClick={handleSaveDetails}
                      className="w-full yatrachain-button bg-gradient-primary"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <User className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p>Select a user to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Bar */}
          <div className="p-6 pb-0">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 transition-all duration-200 focus:shadow-focus"
              />
            </div>
          </div>

          {/* User Table */}
          <div className="flex-1 p-6 overflow-auto">
            <Card className="yatrachain-card">
              <CardHeader>
                <CardTitle>User Directory ({filteredUsers.length} users)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Total Trips</TableHead>
                      <TableHead>Avg Distance</TableHead>
                      <TableHead>Favorite Mode</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className={`cursor-pointer hover:bg-accent/5 transition-colors duration-200 ${
                          selectedUser === user.id ? 'bg-accent/10 border-l-2 border-primary' : ''
                        }`}
                        onClick={() => {
                          setSelectedUser(user.id);
                        }}
                        onDoubleClick={() => handleUserClick(user.id)}
                      >
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(user.category)}>
                            {user.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.tripCount}</TableCell>
                        <TableCell>{user.avgDistance} km</TableCell>
                        <TableCell>{user.favoriteMode}</TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserClick(user.id);
                            }}
                            className="text-xs"
                          >
                            View Trips
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;