import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

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

const mockUsers = [
  { id: 'U001', name: 'Rajesh Kumar', email: 'rajesh.kumar@example.com', phone: '+91 9876543210', category: 'Worker', tripCount: 245, lastActive: '2024-09-17', avgDistance: 12.5, favoriteMode: 'Bus' },
  { id: 'U002', name: 'Priya Nair', email: 'priya.nair@example.com', phone: '+91 9876543211', category: 'Student', tripCount: 189, lastActive: '2024-09-16', avgDistance: 8.3, favoriteMode: 'Metro' },
  { id: 'U003', name: 'John Thomas', email: 'john.thomas@example.com', phone: '+91 9876543212', category: 'Tourist', tripCount: 76, lastActive: '2024-09-15', avgDistance: 25.1, favoriteMode: 'Train' },
  { id: 'U004', name: 'Sarah Abraham', email: 'sarah.abraham@example.com', phone: '+91 9876543213', category: 'Worker', tripCount: 312, lastActive: '2024-09-17', avgDistance: 15.7, favoriteMode: 'Two-Wheeler' },
  { id: 'U005', name: 'Mohammed Ali', email: 'mohammed.ali@example.com', phone: '+91 9876543214', category: 'Student', tripCount: 134, lastActive: '2024-09-17', avgDistance: 6.2, favoriteMode: 'Walk' },
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

  const handleUserClick = (userId: string) => navigate(`/users/${userId}/trips`);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Worker': return 'bg-blue-100 text-blue-800';
      case 'Student': return 'bg-green-100 text-green-800';
      case 'Tourist': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedUserData = selectedUser ? mockUsers.find(u => u.id === selectedUser) : null;

  const handleSaveDetails = () => setIsEditing(false);

  const handleUserDetailsChange = (field: string, value: string) => {
    if (selectedUserData) {
      const userIndex = mockUsers.findIndex(u => u.id === selectedUser);
      if (userIndex !== -1) (mockUsers[userIndex] as any)[field] = value;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Top Bar */}
      <motion.div 
        className="border-b px-6 py-4 bg-gradient-to-r from-indigo-100 via-indigo-50 to-indigo-100 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">Users</h1>
            <Breadcrumbs />
          </div>
        </div>
      </motion.div>

      <div className="flex flex-1 overflow-hidden">
        {/* User Details Panel */}
        <motion.div 
          className="w-80 border-r p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-800">
                  <User className="h-5 w-5" />
                  User Details
                </div>
                {selectedUserData && (
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedUserData ? (
                <div className="space-y-3">
                  {['name','email','phone'].map((field) => (
                    <div key={field}>
                      <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                        {field === 'email' && <Mail className="h-4 w-4" />}
                        {field === 'phone' && <Phone className="h-4 w-4" />}
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        value={(selectedUserData as any)[field]}
                        disabled={!isEditing}
                        onChange={(e) => handleUserDetailsChange(field, e.target.value)}
                        className="mt-1 rounded-lg shadow-sm focus:ring-indigo-400 transition-all duration-200"
                      />
                    </div>
                  ))}
                  {isEditing && (
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Button
                        onClick={handleSaveDetails}
                        className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 transition-all"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </motion.div>
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
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Bar */}
          <motion.div 
            className="p-6 pb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-lg shadow-sm focus:ring-indigo-400 transition-all duration-200"
              />
            </div>
          </motion.div>

          {/* User Table */}
          <motion.div 
            className="flex-1 p-6 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-indigo-800 font-semibold">User Directory ({filteredUsers.length} users)</CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-indigo-50">
                      {['User ID','Name','Category','Total Trips','Avg Distance','Favorite Mode','Last Active','Actions'].map(head => (
                        <TableHead key={head}>{head}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, idx) => (
                      <motion.tr
                        key={user.id}
                        className={`cursor-pointer transition-colors duration-200 hover:bg-indigo-50 ${
                          selectedUser === user.id ? 'bg-indigo-100 border-l-2 border-indigo-600' : ''
                        }`}
                        onClick={() => setSelectedUser(user.id)}
                        onDoubleClick={() => handleUserClick(user.id)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.02 }}
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
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleUserClick(user.id); }}
                              className="text-xs"
                            >
                              View Trips
                            </Button>
                          </motion.div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Users;
