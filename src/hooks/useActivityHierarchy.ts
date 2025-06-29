
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GardenActivity } from '@/types/garden';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export const useActivityHierarchy = () => {
  const [loading, setLoading] = useState(false);

  // Fetch activities with their children for a specific date
  const fetchActivitiesWithChildren = useCallback(async (date: Date): Promise<GardenActivity[]> => {
    setLoading(true);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      console.log('useActivityHierarchy - Fetching for date:', dateStr);
      
      // Fetch all activities for the specific date - both parent activities and child activities
      const { data, error } = await supabase
        .from('garden_activities')
        .select('*')
        .eq('scheduled_date', dateStr)
        .order('activity_order', { ascending: true });

      if (error) throw error;

      console.log('useActivityHierarchy - Raw data from DB:', data);

      if (!data || data.length === 0) {
        console.log('useActivityHierarchy - No activities found for date:', dateStr);
        return [];
      }

      // For activities on this date, we need to:
      // 1. Show parent activities with their children (only children on the same date)
      // 2. Show child activities as standalone if they're on a different date than their parent

      const activities: GardenActivity[] = [];
      const childrenMap = new Map<string, GardenActivity[]>();

      // Get all parent activities that have children on this date
      const parentIds = data
        .filter(activity => activity.parent_activity_id)
        .map(activity => activity.parent_activity_id);

      let parentActivitiesOnSameDate: any[] = [];
      if (parentIds.length > 0) {
        const { data: parentData } = await supabase
          .from('garden_activities')
          .select('*')
          .in('id', parentIds)
          .eq('scheduled_date', dateStr);
        
        parentActivitiesOnSameDate = parentData || [];
      }

      // First pass: separate parents and children
      data.forEach((activity: any) => {
        // Double-check that the activity is for the correct date
        if (activity.scheduled_date !== dateStr) {
          console.warn('useActivityHierarchy - Activity has wrong date:', activity.scheduled_date, 'expected:', dateStr);
          return; // Skip this activity
        }

        const mappedActivity: GardenActivity = {
          id: activity.id,
          title: activity.title || 'Untitled',
          description: activity.description || '',
          date: activity.scheduled_date,
          activity_time: activity.activity_time,
          completed: Boolean(activity.completed),
          category_id: activity.category_id,
          priority: (activity.priority as "high" | "normal" | "low") || "normal",
          status: (activity.status as "pending" | "in_progress" | "done") || "pending",
          outcome_rating: activity.outcome_rating,
          outcome_log: activity.outcome_log,
          track: Boolean(activity.track),
          action: (activity.action as "plant" | "transplant" | "seed" | "harvest" | "water" | "fertilize" | "prune" | "other") || "other",
          parent_activity_id: activity.parent_activity_id,
          has_children: Boolean(activity.has_children),
          activity_order: activity.activity_order || 0,
          depth_level: activity.depth_level || 0,
          children: []
        };

        if (activity.parent_activity_id) {
          // This is a child activity
          // Check if its parent is on the same date
          const parentOnSameDate = parentActivitiesOnSameDate.find(p => p.id === activity.parent_activity_id);
          
          if (parentOnSameDate) {
            // Parent is on same date, add as child
            if (!childrenMap.has(activity.parent_activity_id)) {
              childrenMap.set(activity.parent_activity_id, []);
            }
            childrenMap.get(activity.parent_activity_id)!.push(mappedActivity);
          } else {
            // Parent is on different date, show as standalone activity
            activities.push(mappedActivity);
          }
        } else {
          // This is a parent/root activity
          activities.push(mappedActivity);
        }
      });

      // Add parent activities that are on the same date
      parentActivitiesOnSameDate.forEach((parentActivity: any) => {
        // Check if we already added this parent (it might have been added as a root activity)
        if (!activities.find(a => a.id === parentActivity.id)) {
          const mappedParent: GardenActivity = {
            id: parentActivity.id,
            title: parentActivity.title || 'Untitled',
            description: parentActivity.description || '',
            date: parentActivity.scheduled_date,
            activity_time: parentActivity.activity_time,
            completed: Boolean(parentActivity.completed),
            category_id: parentActivity.category_id,
            priority: (parentActivity.priority as "high" | "normal" | "low") || "normal",
            status: (parentActivity.status as "pending" | "in_progress" | "done") || "pending",
            outcome_rating: parentActivity.outcome_rating,
            outcome_log: parentActivity.outcome_log,
            track: Boolean(parentActivity.track),
            action: (parentActivity.action as "plant" | "transplant" | "seed" | "harvest" | "water" | "fertilize" | "prune" | "other") || "other",
            parent_activity_id: parentActivity.parent_activity_id,
            has_children: Boolean(parentActivity.has_children),
            activity_order: parentActivity.activity_order || 0,
            depth_level: parentActivity.depth_level || 0,
            children: []
          };
          activities.push(mappedParent);
        }
      });

      // Second pass: attach children to parents
      activities.forEach(activity => {
        if (activity.has_children && childrenMap.has(activity.id)) {
          activity.children = childrenMap.get(activity.id)!.sort(
            (a, b) => (a.activity_order || 0) - (b.activity_order || 0)
          );
        }
      });

      console.log('useActivityHierarchy - Final processed activities:', activities);
      return activities.sort((a, b) => (a.activity_order || 0) - (b.activity_order || 0));
    } catch (error: any) {
      console.error('Error fetching activities with children:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch activities",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a child activity
  const createChildActivity = useCallback(async (
    parentActivity: GardenActivity,
    childData: Partial<GardenActivity>
  ): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to create activities",
          variant: "destructive"
        });
        return false;
      }

      // Get the current max order for children of this parent
      const { data: existingChildren } = await supabase
        .from('garden_activities')
        .select('activity_order')
        .eq('parent_activity_id', parentActivity.id)
        .order('activity_order', { ascending: false })
        .limit(1);

      const nextOrder = existingChildren && existingChildren.length > 0 
        ? (existingChildren[0].activity_order || 0) + 1 
        : 1;

      // Use the provided date or default to parent's date
      const scheduledDate = childData.date || parentActivity.date;

      const { error } = await supabase
        .from('garden_activities')
        .insert({
          title: childData.title || 'Subtask',
          description: childData.description || '',
          scheduled_date: scheduledDate, // Allow different date from parent
          activity_time: childData.activity_time || parentActivity.activity_time,
          priority: childData.priority || parentActivity.priority || 'normal',
          status: childData.status || 'pending',
          action: childData.action || parentActivity.action || 'other',
          track: childData.track !== undefined ? childData.track : true,
          user_id: session.user.id,
          parent_activity_id: parentActivity.id,
          activity_order: nextOrder,
          depth_level: (parentActivity.depth_level || 0) + 1,
          completed: false,
          has_children: false
        });

      if (error) throw error;

      toast({
        title: "Subtask created",
        description: "The subtask has been added to the activity.",
      });

      return true;
    } catch (error: any) {
      console.error('Error creating child activity:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create subtask",
        variant: "destructive"
      });
      return false;
    }
  }, []);

  return {
    loading,
    fetchActivitiesWithChildren,
    createChildActivity
  };
};
