import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { motion } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'today' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id: string | null;
  team_id: string | null;
  percentage_complete: number;
  tags: string[];
  due_date: string | null;
}

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

export const KanbanColumn = ({ id, title, color, tasks }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex h-full min-h-[600px] flex-col rounded-2xl border border-border/50 bg-card/30 p-4 transition-all ${
        isOver ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${color}`} />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
