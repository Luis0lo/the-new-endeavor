
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  username: string;
}

export const useUserRoles = (isAdmin: boolean) => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const fetchUserRoles = async () => {
    try {
      setLoadingRoles(true);
      
      // Get user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        toast({
          title: "Error",
          description: "Failed to load user roles.",
          variant: "destructive"
        });
        return;
      }

      // Get profiles for each user_id
      const userIds = rolesData?.map(role => role.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Combine the data
      const combinedData = rolesData?.map(role => {
        const profile = profilesData?.find(p => p.id === role.user_id);
        return {
          ...role,
          username: profile?.username || 'Unknown User'
        };
      }) || [];

      setUserRoles(combinedData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUserRoles();
    }
  }, [isAdmin]);

  return {
    userRoles,
    loadingRoles,
    fetchUserRoles
  };
};
