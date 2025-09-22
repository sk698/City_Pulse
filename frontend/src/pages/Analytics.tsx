import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Calendar,
  MapPin
} from 'lucide-react';
import api from '@/lib/api';

export const Analytics = () => {
  const [stats, setStats] = useState<any>(null);
  const [issuesByCategory, setIssuesByCategory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [statsRes, categoryRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/issues-by-category')
        ]);

        setStats(statsRes.data.data);
        setIssuesByCategory(categoryRes.data.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const resolutionRate = stats ? ((stats.resolvedIssues / stats.totalIssues) * 100) : 0;
  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const statusData = stats ? [
    { name: 'Pending', value: stats.pendingIssues, color: '#f59e0b' },
    { name: 'In Progress', value: stats.totalIssues - stats.pendingIssues - stats.resolvedIssues, color: '#3b82f6' },
    { name: 'Resolved', value: stats.resolvedIssues, color: '#10b981' },
  ] : [];

  const monthlyData = [
    { month: 'Jan', issues: 12, resolved: 8 },
    { month: 'Feb', issues: 18, resolved: 14 },
    { month: 'Mar', issues: 25, resolved: 20 },
    { month: 'Apr', issues: 32, resolved: 24 },
    { month: 'May', issues: 28, resolved: 26 },
    { month: 'Jun', issues: 35, resolved: 30 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into community engagement and issue resolution
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
                <p className="text-2xl font-bold">{stats?.totalIssues || 0}</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
                <p className="text-2xl font-bold">{resolutionRate.toFixed(1)}%</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% from last month
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Resolution Time</p>
                <p className="text-2xl font-bold">4.2 days</p>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -0.8 days improved
                </div>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">1,247</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18% this month
                </div>
              </div>
              <Users className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Issue Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Issue Status Distribution</CardTitle>
            <CardDescription>Current breakdown of all reported issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Issue Trends</CardTitle>
            <CardDescription>Issues reported vs. resolved over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="issues" fill="#3b82f6" name="Reported" />
                  <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Issues by Category</CardTitle>
          <CardDescription>Distribution of issues across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {issuesByCategory.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {category.category === 'pothole' && '🕳️'}
                      {category.category === 'garbage' && '🗑️'}
                      {category.category === 'streetlight' && '💡'}
                      {category.category === 'water' && '💧'}
                      {category.category === 'other' && '📋'}
                    </span>
                    <span className="font-medium capitalize">{category.category}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{category.count} issues</Badge>
                    <span className="text-sm text-muted-foreground">
                      {((category.count / stats?.totalIssues) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress 
                  value={(category.count / stats?.totalIssues) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-600">Most Improved</CardTitle>
            <CardDescription>Areas showing significant progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Street Lighting</span>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+32%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Water Issues</span>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+28%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-orange-600">Needs Attention</CardTitle>
            <CardDescription>Areas requiring focus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pothole Repairs</span>
                <div className="flex items-center text-orange-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="text-sm">-12%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Garbage Collection</span>
                <div className="flex items-center text-orange-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="text-sm">-8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-blue-600">Quick Stats</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Response Time</span>
                <span className="font-medium">2.1 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Community Satisfaction</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Campaigns</span>
                <span className="font-medium">{stats?.activeCampaigns || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};