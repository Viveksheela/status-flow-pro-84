import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Clock, User, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TaskWithDetails {
  id: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
  assignee_id: string | null;
  team_id: string | null;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
  teams?: {
    name: string;
  } | null;
}

interface TaskListProps {
  tasks: TaskWithDetails[];
  title: string;
}

const statusColors = {
  backlog: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  today: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  review: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  done: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const priorityColors = {
  low: 'bg-slate-500/20 text-slate-300',
  medium: 'bg-blue-500/20 text-blue-300',
  high: 'bg-amber-500/20 text-amber-300',
  urgent: 'bg-red-500/20 text-red-300',
};

export function TaskList({ tasks, title }: TaskListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks found</p>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass hover-lift border-border/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                        {task.priority}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      {task.teams && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{task.teams.name}</span>
                        </div>
                      )}
                      
                      {task.profiles && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{task.profiles.full_name || task.profiles.email}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                    {task.status}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
