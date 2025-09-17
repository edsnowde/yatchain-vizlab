import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, User, MapPin, Clock } from 'lucide-react';

// Mock user data
const mockUsers = [
  {
    id: 'U001',
    category: 'Worker',
    tripCount: 245,
    lastActive: '2024-09-17',
    avgDistance: 12.5,
    favoriteMode: 'Bus',
  },
  {
    id: 'U002', 
    category: 'Student',
    tripCount: 189,
    lastActive: '2024-09-16',
    avgDistance: 8.3,
    favoriteMode: 'Metro',
  },
  {
    id: 'U003',
    category: 'Tourist',
    tripCount: 76,
    lastActive: '2024-09-15',
    avgDistance: 25.1,
    favoriteMode: 'Train',
  },
  {
    id: 'U004',
    category: 'Worker',
    tripCount: 312,
    lastActive: '2024-09-17',
    avgDistance: 15.7,
    favoriteMode: 'Two-Wheeler',
  },
  {
    id: 'U005',
    category: 'Student',
    tripCount: 134,
    lastActive: '2024-09-17',
    avgDistance: 6.2,
    favoriteMode: 'Walk',
  },
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
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

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Users</h1>
            <Breadcrumbs />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Table */}
        <div className="flex-1 p-6 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>User Directory ({filteredUsers.length} users)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Total Trips</TableHead>
                    <TableHead>Avg Distance</TableHead>
                    <TableHead>Favorite Mode</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedUser(user.id);
                        handleUserClick(user.id);
                      }}
                    >
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(user.category)}>
                          {user.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.tripCount}</TableCell>
                      <TableCell>{user.avgDistance} km</TableCell>
                      <TableCell>{user.favoriteMode}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - User Preview */}
        {selectedUserData && (
          <div className="w-80 border-l p-6 bg-card">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {selectedUserData.id} Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <Badge className={getCategoryColor(selectedUserData.category)}>
                      {selectedUserData.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Trips</p>
                    <p className="font-semibold">{selectedUserData.tripCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Distance</p>
                    <p className="font-semibold">{selectedUserData.avgDistance} km</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Favorite Mode</p>
                    <p className="font-semibold">{selectedUserData.favoriteMode}</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => handleUserClick(selectedUserData.id)}
                >
                  View All Trips
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;