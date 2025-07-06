
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  username: string;
}

interface UserRolesTableProps {
  userRoles: UserRole[];
  loadingRoles: boolean;
  onRefresh: () => void;
}

const UserRolesTable = ({ userRoles, loadingRoles, onRefresh }: UserRolesTableProps) => {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'moderator': return 'default';
      case 'user': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Roles</CardTitle>
          <Button onClick={onRefresh} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loadingRoles ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading user roles...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userRoles.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No user roles found.
              </p>
            ) : (
              userRoles.map((userRole) => (
                <div
                  key={userRole.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">
                        {userRole.username}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ID: {userRole.user_id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getRoleBadgeVariant(userRole.role)}>
                      {userRole.role}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(userRole.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRolesTable;
