
-- Fix the search_path parameter for the security definer functions
-- This addresses the "Function Search Path Mutable" warnings

-- Update the has_role function to set a secure search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update the get_current_user_role function to set a secure search_path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1
$$;

-- Update the update_parent_has_children function to set a secure search_path
CREATE OR REPLACE FUNCTION public.update_parent_has_children()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;
