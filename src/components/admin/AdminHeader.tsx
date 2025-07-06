
import React from 'react';
import { Shield } from 'lucide-react';

const AdminHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      <p className="text-muted-foreground">
        Welcome to the admin panel. Manage users, roles, and system settings.
      </p>
    </div>
  );
};

export default AdminHeader;
