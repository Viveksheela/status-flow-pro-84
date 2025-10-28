-- Fix foreign key constraint to point to profiles instead of auth.users

-- Drop the existing incorrect foreign key
ALTER TABLE public.tasks
DROP CONSTRAINT IF EXISTS tasks_assignee_id_fkey;

-- Add the correct foreign key pointing to profiles
ALTER TABLE public.tasks
ADD CONSTRAINT tasks_assignee_id_fkey
FOREIGN KEY (assignee_id)
REFERENCES public.profiles(id)
ON DELETE SET NULL;