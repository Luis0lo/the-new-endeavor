
-- Add parent_activity_id column to garden_activities table to create parent-child relationships
ALTER TABLE public.garden_activities 
ADD COLUMN parent_activity_id UUID REFERENCES public.garden_activities(id) ON DELETE CASCADE;

-- Add has_children boolean flag for quick filtering of parent activities
ALTER TABLE public.garden_activities 
ADD COLUMN has_children BOOLEAN DEFAULT FALSE;

-- Add activity_order for ordering child activities
ALTER TABLE public.garden_activities 
ADD COLUMN activity_order INTEGER DEFAULT 0;

-- Add depth_level for nested hierarchies
ALTER TABLE public.garden_activities 
ADD COLUMN depth_level INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX idx_garden_activities_parent_id ON public.garden_activities(parent_activity_id);
CREATE INDEX idx_garden_activities_has_children ON public.garden_activities(has_children);
CREATE INDEX idx_garden_activities_order ON public.garden_activities(activity_order);

-- Add comments to document the columns
COMMENT ON COLUMN public.garden_activities.parent_activity_id IS 'References the parent activity if this is a child activity';
COMMENT ON COLUMN public.garden_activities.has_children IS 'True if this activity has child activities';
COMMENT ON COLUMN public.garden_activities.activity_order IS 'Order of child activities under the same parent';
COMMENT ON COLUMN public.garden_activities.depth_level IS 'Depth level in the activity hierarchy (0 = root)';

-- Create a function to update has_children flag when child activities are added/removed
CREATE OR REPLACE FUNCTION update_parent_has_children()
RETURNS TRIGGER AS $$
BEGIN
    -- If inserting a new child activity
    IF TG_OP = 'INSERT' AND NEW.parent_activity_id IS NOT NULL THEN
        UPDATE garden_activities 
        SET has_children = TRUE 
        WHERE id = NEW.parent_activity_id;
    END IF;
    
    -- If updating parent_activity_id
    IF TG_OP = 'UPDATE' THEN
        -- Update old parent if it exists
        IF OLD.parent_activity_id IS NOT NULL THEN
            UPDATE garden_activities 
            SET has_children = CASE 
                WHEN EXISTS(SELECT 1 FROM garden_activities WHERE parent_activity_id = OLD.parent_activity_id AND id != NEW.id) 
                THEN TRUE 
                ELSE FALSE 
            END
            WHERE id = OLD.parent_activity_id;
        END IF;
        
        -- Update new parent if it exists
        IF NEW.parent_activity_id IS NOT NULL THEN
            UPDATE garden_activities 
            SET has_children = TRUE 
            WHERE id = NEW.parent_activity_id;
        END IF;
    END IF;
    
    -- If deleting a child activity
    IF TG_OP = 'DELETE' AND OLD.parent_activity_id IS NOT NULL THEN
        UPDATE garden_activities 
        SET has_children = CASE 
            WHEN EXISTS(SELECT 1 FROM garden_activities WHERE parent_activity_id = OLD.parent_activity_id) 
            THEN TRUE 
            ELSE FALSE 
        END
        WHERE id = OLD.parent_activity_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update has_children flag
CREATE TRIGGER trigger_update_parent_has_children
    AFTER INSERT OR UPDATE OR DELETE ON garden_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_parent_has_children();
