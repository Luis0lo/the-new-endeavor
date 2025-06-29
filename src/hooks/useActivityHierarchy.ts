
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GardenActivity } from '@/types/garden';
import { toast } from '@/hooks/use-toast';

export const useActivityHierarchy = () => {
  const [loading, setLoading] = useState(false);

  // Fetch activities with their children for a specific date
  const fetchActivitiesWithChildren = useCallback(async (date: Date): Promise<GardenActivity[]> => {
    setLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      
      // Fetch all activities for the date
      const { data, error } = await supabase
        .from('garden_activities')
        .select('*')
        .eq('scheduled_date', dateStr)
        .order('activity_order', { ascending: true });

      if (error) throw error;

      // Organize activities into hierarchical structure
      const activities: GardenActivity[] = [];
      const childrenMap = new Map<string, GardenActivity[]>();

      // First pass: separate parents and children
      data?.forEach((activity: any) => {
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
          if (!childrenMap.has(activity.parent_activity_id)) {
            childrenMap.set(activity.parent_activity_id, []);
          }
          childrenMap.get(activity.parent_activity_id)!.push(mappedActivity);
        } else {
          // This is a parent/root activity
          activities.push(mappedActivity);
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

      return activities;
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

      const { error } = await supabase
        .from('garden_activities')
        .insert({
          title: childData.title || 'Subtask',
          description: childData.description || '',
          scheduled_date: parentActivity.date,
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
