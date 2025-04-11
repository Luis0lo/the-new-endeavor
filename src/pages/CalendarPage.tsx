
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import DashboardLayout from '@/components/DashboardLayout';
import GardenCalendar from '@/components/garden/GardenCalendar';

const CalendarPage = () => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-4rem)]">
        <GardenCalendar />
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
