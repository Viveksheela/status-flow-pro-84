import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';

interface TaskNotification {
  id: string;
  title: string;
  team_id: string | null;
}

export function TaskNotificationListener() {
  const { user } = useAuth();
  const [userTeamId, setUserTeamId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Get user's team
    const fetchUserTeam = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('team_id')
        .eq('id', user.id)
        .single();
      
      setUserTeamId(data?.team_id || null);
    };

    fetchUserTeam();

    // Subscribe to new task insertions
    const channel = supabase
      .channel('task-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tasks',
        },
        (payload) => {
          const newTask = payload.new as TaskNotification;
          
          // Show notification if task is assigned to user's team
          if (newTask.team_id && newTask.team_id === userTeamId) {
            toast.success(
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <div>
                  <p className="font-semibold">New Task Assigned</p>
                  <p className="text-sm">{newTask.title}</p>
                </div>
              </div>,
              {
                duration: 5000,
              }
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userTeamId]);

  return null;
}
