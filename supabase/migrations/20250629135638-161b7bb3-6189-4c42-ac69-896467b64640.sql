
-- Update existing activities to have proper default values for the new hierarchy fields
UPDATE public.garden_activities 
SET 
  parent_activity_id = NULL,
  has_children = FALSE,
  activity_order = 0,
  depth_level = 0
WHERE parent_activity_id IS NULL AND has_children IS NULL;

-- Ensure all existing activities have proper default values
UPDATE public.garden_activities 
SET 
  has_children = COALESCE(has_children, FALSE),
  activity_order = COALESCE(activity_order, 0),
  depth_level = COALESCE(depth_level, 0)
WHERE has_children IS NULL OR activity_order IS NULL OR depth_level IS NULL;
