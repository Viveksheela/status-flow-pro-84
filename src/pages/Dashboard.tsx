import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  LogOut,
  Plus,
  KanbanSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface DashboardStats {
  totalTasks: number;
  todayTasks: number;
  completedTasks: number;
  inReviewTasks: number;
  totalUsers: number;
  totalTeams: number;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    todayTasks: 0,
    completedTasks: 0,
    inReviewTasks: 0,
    totalUsers: 0,
    totalTeams: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    checkAdminRole();
  }, []);

  const checkAdminRole = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();
    
    setIsAdmin(!!data);
  };

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, usersRes, teamsRes] = await Promise.all([
        supabase.from('tasks').select('status', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('teams').select('id', { count: 'exact' }),
      ]);

      const tasks = tasksRes.data || [];
      
      setStats({
        totalTasks: tasksRes.count || 0,
        todayTasks: tasks.filter((t: any) => t.status === 'today').length,
        completedTasks: tasks.filter((t: any) => t.status === 'done').length,
        inReviewTasks: tasks.filter((t: any) => t.status === 'review').length,
        totalUsers: usersRes.count || 0,
        totalTeams: teamsRes.count || 0,
      });
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Total Tasks', 
      value: stats.totalTasks, 
      icon: LayoutDashboard, 
      color: 'from-blue-500/20 to-blue-600/20',
      iconColor: 'text-blue-500'
    },
    { 
      title: 'Today', 
      value: stats.todayTasks, 
      icon: Clock, 
      color: 'from-indigo-500/20 to-indigo-600/20',
      iconColor: 'text-indigo-500'
    },
    { 
      title: 'In Review', 
      value: stats.inReviewTasks, 
      icon: AlertCircle, 
      color: 'from-amber-500/20 to-amber-600/20',
      iconColor: 'text-amber-500'
    },
    { 
      title: 'Completed', 
      value: stats.completedTasks, 
      icon: CheckCircle2, 
      color: 'from-green-500/20 to-green-600/20',
      iconColor: 'text-green-500'
    },
    { 
      title: 'Team Members', 
      value: stats.totalUsers, 
      icon: Users, 
      color: 'from-violet-500/20 to-violet-600/20',
      iconColor: 'text-violet-500'
    },
    { 
      title: 'Teams', 
      value: stats.totalTeams, 
      icon: TrendingUp, 
      color: 'from-purple-500/20 to-purple-600/20',
      iconColor: 'text-purple-500'
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Daily Status Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/kanban')}
              className="hover-lift"
            >
              <KanbanSquare className="mr-2 h-4 w-4" />
              Kanban Board
            </Button>
            {isAdmin && (
              <Button
                variant="ghost"
                onClick={() => navigate('/users')}
                className="hover-lift"
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={signOut}
              className="hover-lift"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="mb-2 text-3xl font-bold">Welcome back, {user?.user_metadata?.full_name || 'User'}!</h2>
          <p className="text-muted-foreground">Here's your team's performance overview</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`glass hover-lift border-border/50 bg-gradient-to-br ${card.color} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <p className="mt-2 text-3xl font-bold">{card.value}</p>
                  </div>
                  <div className={`rounded-xl bg-card/50 p-3 ${card.iconColor}`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass border-border/50 p-6">
            <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate('/kanban')}
                className="gradient-primary text-white hover:opacity-90"
              >
                <KanbanSquare className="mr-2 h-4 w-4" />
                View Kanban Board
              </Button>
              <Button
                onClick={() => navigate('/kanban?createTask=true')}
                variant="outline"
                className="hover-lift"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Task
              </Button>
              {isAdmin && (
                <Button
                  onClick={() => navigate('/users')}
                  variant="outline"
                  className="hover-lift"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Team
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
