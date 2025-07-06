
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useUserRoles } from '@/hooks/useUserRoles';
import { toast } from '@/hooks/use-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStats from '@/components/admin/AdminStats';
import UserRolesTable from '@/components/admin/UserRolesTable';

const AdminPage = () => {
  const { isAdmin, isLoading } = useAdminCheck();
  const navigate = useNavigate();
  const { userRoles, loadingRoles, fetchUserRoles } = useUserRoles(isAdmin);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Checking permissions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <AdminHeader />
        <AdminStats userRoles={userRoles} />
        <UserRolesTable 
          userRoles={userRoles} 
          loadingRoles={loadingRoles} 
          onRefresh={fetchUserRoles} 
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminPage;
