import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  MapPin,
  Calendar,
  Download,
  Filter
} from "lucide-react";
import { useState } from "react";

// Mock analytics data
const mockAnalytics = {
  totalReports: 1247,
  avgResolutionTime: 3.2,
  resolutionRate: 87,
  citizenSatisfaction: 4.2,
  monthlyGrowth: 12,
  topCategories: [
    { category: "Infrastructure", count: 456, percentage: 36.6, trend: "+8%" },
    { category: "Environment", count: 312, percentage: 25.0, trend: "+15%" },
    { category: "Safety", count: 201, percentage: 16.1, trend: "-3%" },
    { category: "Transport", count: 178, percentage: 14.3, trend: "+5%" },
    { category: "Other", count: 100, percentage: 8.0, trend: "+2%" }
  ],
  resolutionTrends: [
    { month: "Jan", resolved: 89, pending: 23 },
    { month: "Feb", resolved: 95, pending: 18 },
    { month: "Mar", resolved: 102, pending: 15 },
    { month: "Apr", resolved: 87, pending: 28 },
    { month: "May", resolved: 118, pending: 12 },
    { month: "Jun", resolved: 124, pending: 9 }
  ],
  topLocations: [
    { location: "Downtown District", reports: 89, change: "+12%" },
    { location: "Riverside Area", reports: 67, change: "+8%" },
    { location: "Industrial Zone", reports: 54, change: "-5%" },
    { location: "Business Center", reports: 43, change: "+15%" },
    { location: "Residential North", reports: 38, change: "+3%" }
  ],
  responseMetrics: {
    avgFirstResponse: "2.4 hours",
    avgResolution: "3.2 days", 
    satisfactionScore: 4.2,
    escalationRate: 8.5
  }
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("6months");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Insights and trends from city reporting data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Reports"
          value={mockAnalytics.totalReports.toLocaleString()}
          change={`+${mockAnalytics.monthlyGrowth}% this month`}
          changeType="positive"
          icon={BarChart3}
          description="All-time submissions"
        />
        <StatsCard
          title="Resolution Rate"
          value={`${mockAnalytics.resolutionRate}%`}
          change="+3% improvement"
          changeType="positive"
          icon={TrendingUp}
          description="Issues resolved"
        />
        <StatsCard
          title="Avg Resolution Time"
          value={`${mockAnalytics.avgResolutionTime} days`}
          change="-0.3 days faster"
          changeType="positive"
          icon={Clock}
          description="Time to close"
        />
        <StatsCard
          title="Satisfaction Score"
          value={`${mockAnalytics.citizenSatisfaction}/5.0`}
          change="+0.2 improvement"
          changeType="positive"
          icon={TrendingUp}
          description="Citizen feedback"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Report Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Reports by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAnalytics.topCategories.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={
                        item.trend.startsWith('+') 
                          ? 'text-success border-success/20 bg-success/10' 
                          : 'text-destructive border-destructive/20 bg-destructive/10'
                      }
                    >
                      {item.trend}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {item.count} reports
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Report Hotspots
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAnalytics.topLocations.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="space-y-1">
                  <p className="font-medium">{location.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {location.reports} reports
                  </p>
                </div>
                <Badge 
                  variant="outline"
                  className={
                    location.change.startsWith('+') 
                      ? 'text-destructive border-destructive/20 bg-destructive/10' 
                      : 'text-success border-success/20 bg-success/10'
                  }
                >
                  {location.change}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Response Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Response Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {mockAnalytics.responseMetrics.avgFirstResponse}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Avg First Response
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {mockAnalytics.responseMetrics.avgResolution}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Avg Resolution Time
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {mockAnalytics.responseMetrics.satisfactionScore}/5.0
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Satisfaction Score
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {mockAnalytics.responseMetrics.escalationRate}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Escalation Rate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Resolution Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-4">
              {mockAnalytics.resolutionTrends.map((month, index) => (
                <div key={index} className="text-center space-y-2">
                  <p className="text-sm font-medium">{month.month}</p>
                  <div className="space-y-1">
                    <div className="bg-success/20 rounded p-2">
                      <p className="text-lg font-bold text-success">{month.resolved}</p>
                      <p className="text-xs text-muted-foreground">Resolved</p>
                    </div>
                    <div className="bg-warning/20 rounded p-2">
                      <p className="text-lg font-bold text-warning">{month.pending}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}