import { StatsCard } from "@/components/StatsCard";
import { ReportCard, Report } from "@/components/ReportCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  MapPin,
  Plus,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-city.jpg";

// Mock data - replace with actual API calls
const mockStats = {
  totalReports: 1247,
  activeReports: 89,
  resolvedToday: 23,
  avgResolutionTime: "3.2 days"
};

const mockRecentReports: Report[] = [
  {
    id: "1",
    title: "Broken streetlight on Main Street",
    description: "The streetlight near the bus stop has been flickering for days and now completely stopped working. This creates a safety hazard for pedestrians at night.",
    category: "infrastructure",
    status: "investigating",
    priority: "high",
    location: "Main Street, Downtown",
    submittedBy: "Sarah Johnson",
    submittedAt: "2024-01-15T10:30:00Z",
    upvotes: 15,
    comments: 3
  },
  {
    id: "2", 
    title: "Pothole causing traffic issues",
    description: "Large pothole on Oak Avenue is causing cars to swerve and creating dangerous driving conditions.",
    category: "infrastructure",
    status: "pending",
    priority: "urgent",
    location: "Oak Avenue, Riverside District", 
    submittedBy: "Mike Chen",
    submittedAt: "2024-01-14T15:45:00Z",
    upvotes: 28,
    comments: 7
  },
  {
    id: "3",
    title: "Excessive litter in Central Park",
    description: "The park has accumulated a lot of trash near the playground area. Needs immediate cleanup for health and safety.",
    category: "environment",
    status: "resolved",
    priority: "medium",
    location: "Central Park, Playground Area",
    submittedBy: "Lisa Rodriguez",
    submittedAt: "2024-01-13T09:15:00Z",
    upvotes: 12,
    comments: 2
  }
];

const mockHotspots = [
  { location: "Downtown District", reports: 45, change: "+12%" },
  { location: "Riverside Area", reports: 32, change: "+8%" },
  { location: "Industrial Zone", reports: 28, change: "-5%" },
  { location: "Residential North", reports: 19, change: "+3%" }
];

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl gradient-hero p-8 text-primary-foreground overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to City Pulse
          </h1>
          <p className="text-lg mb-6 max-w-2xl text-primary-foreground/90">
            Monitor city-wide reports, track resolution progress, and gain insights 
            into urban challenges through AI-powered analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link to="/submit">
                <Plus className="h-4 w-4" />
                Submit New Report
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20">
              <Link to="/analytics">
                <TrendingUp className="h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Reports"
          value={mockStats.totalReports.toLocaleString()}
          change="+12% from last month"
          changeType="positive"
          icon={FileText}
          description="All-time submissions"
        />
        <StatsCard
          title="Active Reports"
          value={mockStats.activeReports}
          change="23 opened today"
          changeType="neutral"
          icon={Clock}
          description="Pending & investigating"
        />
        <StatsCard
          title="Resolved Today"
          value={mockStats.resolvedToday}
          change="+8% efficiency"
          changeType="positive"
          icon={CheckCircle}
          description="Issues closed"
        />
        <StatsCard
          title="Avg Resolution"
          value={mockStats.avgResolutionTime}
          change="-0.3 days improvement"
          changeType="positive"
          icon={TrendingUp}
          description="Time to resolve"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reports */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Reports
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="gap-2">
                  <Link to="/reports">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRecentReports.map((report) => (
                <ReportCard 
                  key={report.id} 
                  report={report}
                  onView={(report) => console.log("View report:", report.id)}
                  onUpvote={(id) => console.log("Upvote report:", id)}
                  onComment={(id) => console.log("Comment on report:", id)}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Hotspots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Report Hotspots
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockHotspots.map((hotspot, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{hotspot.location}</p>
                    <p className="text-xs text-muted-foreground">
                      {hotspot.reports} reports
                    </p>
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      hotspot.change.startsWith('+') 
                        ? 'text-destructive border-destructive/20 bg-destructive/10' 
                        : 'text-success border-success/20 bg-success/10'
                    }
                  >
                    {hotspot.change}
                  </Badge>
                </div>  
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start gap-3" variant="outline">
                <Link to="/submit">
                  <Plus className="h-4 w-4" />
                  Submit New Report
                </Link>
              </Button>
              <Button asChild className="w-full justify-start gap-3" variant="outline">
                <Link to="/reports?status=urgent">
                  <AlertTriangle className="h-4 w-4" />
                  View Urgent Reports
                </Link>
              </Button>
              <Button asChild className="w-full justify-start gap-3" variant="outline">
                <Link to="/analytics">
                  <TrendingUp className="h-4 w-4" />
                  Analytics Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}