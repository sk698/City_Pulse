import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Plus,
  MapPin,
  Star,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import type { DashboardStats, Issue, Campaign } from '@/types';

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, issuesRes, campaignsRes, notificationsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/recent-issues'),
          api.get('/campaign'),
          api.get('/dashboard/notifications')
        ]);

        setStats(statsRes.data?.data || null);
        setRecentIssues(issuesRes.data?.data.issues || []);
        setActiveCampaigns((campaignsRes.data?.data || []).filter((c: Campaign) => c.campaignStatus === 'ongoing'));
        setNotifications(notificationsRes.data?.data || []);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setStats({ totalIssues: 0, resolvedIssues: 0, pendingIssues: 0, activeCampaigns: 0, userPoints: 0 });
        setRecentIssues([]);
        setActiveCampaigns([]);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'verified': return 'bg-yellow-500';
      case 'pending': return 'bg-orange-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pothole': return '🕳️';
      case 'garbage': return '🗑️';
      case 'streetlight': return '💡';
      case 'water': return '💧';
      default: return '📋';
    }
  };

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back to City Pulse</h1>
        <p className="text-muted-foreground">
          Here's what's happening in your community today
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
                <p className="text-2xl font-bold">{stats?.totalIssues || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{stats?.resolvedIssues || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats?.pendingIssues || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-secondary" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Your Points</p>
                <p className="text-2xl font-bold">{stats?.userPoints || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Issues</CardTitle>
              <Link to="/issues">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <CardDescription>Latest reported issues in your area</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Recent Issues List */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Notifications</CardTitle>
              <Link to="/notifications">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <CardDescription>Updates on your issues and community activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No new notifications.</p>
              ) : (
                notifications.slice(0, 4).map((notification) => (
                  <div key={notification._id} className="flex items-start space-x-3">
                    <Bell className="h-4 w-4 mt-1 text-primary" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Campaigns and Quick Actions Cards */}
      </div>
    </div>
  );
};