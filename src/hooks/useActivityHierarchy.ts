
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
      
      // First, get all activities for the specific date
      const { data: activitiesForDate, error: activitiesError } = await supabase
        .from('garden_activities')
        .select('*')
        .eq('scheduled_date', dateStr)
        .order('activity_order', { ascending: true });

      if (activitiesError) throw activitiesError;

      console.log('useActivityHierarchy - Activities for date:', activitiesForDate);

      if (!activitiesForDate || activitiesForDate.length === 0) {
        console.log('useActivityHierarchy - No activities found for date:', dateStr);
        return [];
      }

      const activities: GardenActivity[] = [];
      const parentIdsOnThisDate = new Set();
      const childActivitiesOnThisDate = new Map<string, GardenActivity[]>();

      // Process activities for this date
      for (const activity of activitiesForDate) {
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
          // This is a child activity - check if parent is on the same date
          const parentOnSameDate = activitiesForDate.find(p => p.id === activity.parent_activity_id);
          
          if (parentOnSameDate) {
            // Parent is on same date, add as child
            if (!childActivitiesOnThisDate.has(activity.parent_activity_id)) {
              childActivitiesOnThisDate.set(activity.parent_activity_id, []);
            }
            childActivitiesOnThisDate.get(activity.parent_activity_id)!.push(mappedActivity);
            parentIdsOnThisDate.add(activity.parent_activity_id);
          } else {
            // Parent is on different date, show as standalone activity
            activities.push(mappedActivity);
          }
        } else {
          // This is a root activity
          activities.push(mappedActivity);
        }
      }

      // Now fetch children for parent activities that are on this date
      if (parentIdsOnThisDate.size > 0) {
        const parentIds = Array.from(parentIdsOnThisDate);
        console.log('useActivityHierarchy - Fetching children for parents:', parentIds);
        
        const { data: childrenData, error: childrenError } = await supabase
          .from('garden_activities')
          .select('*')
          .in('parent_activity_id', parentIds)
          .order('activity_order', { ascending: true });

        if (childrenError) {
          console.error('Error fetching children:', childrenError);
        } else if (childrenData) {
          console.log('useActivityHierarchy - Found children:', childrenData);
          
          // Group children by parent
          for (const child of childrenData) {
            if (!childActivitiesOnThisDate.has(child.parent_activity_id)) {
              childActivitiesOnThisDate.set(child.parent_activity_id, []);
            }
            
            const mappedChild: GardenActivity = {
              id: child.id,
              title: child.title || 'Untitled',
              description: child.description || '',
              date: child.scheduled_date,
              activity_time: child.activity_time,
              completed: Boolean(child.completed),
              category_id: child.category_id,
              priority: (child.priority as "high" | "normal" | "low") || "normal",
              status: (child.status as "pending" | "in_progress" | "done") || "pending",
              outcome_rating: child.outcome_rating,
              outcome_log: child.outcome_log,
              track: Boolean(child.track),
              action: (child.action as "plant" | "transplant" | "seed" | "harvest" | "water" | "fertilize" | "prune" | "other") || "other",
              parent_activity_id: child.parent_activity_id,
              has_children: Boolean(child.has_children),
              activity_order: child.activity_order || 0,
              depth_level: child.depth_level || 0,
              children: []
            };
            
            childActivitiesOnThisDate.get(child.parent_activity_id)!.push(mappedChild);
          }
        }
      }

      // Attach children to their parents
      activities.forEach(activity => {
        if (activity.has_children && childActivitiesOnThisDate.has(activity.id)) {
          activity.children = childActivitiesOnThisDate.get(activity.id)!.sort(
            (a, b) => (a.activity_order || 0) - (b.activity_order || 0)
          );
          console.log(`useActivityHierarchy - Attached ${activity.children.length} children to activity:`, activity.title);
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
          scheduled_date: scheduledDate,
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

      // Update parent to mark it has children if it doesn't already
      if (!parentActivity.has_children) {
        await supabase
          .from('garden_activities')
          .update({ has_children: true })
          .eq('id', parentActivity.id);
      }

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
