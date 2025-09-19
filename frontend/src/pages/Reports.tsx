import { useState } from "react";
import { ReportCard, Report } from "@/components/ReportCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  FileText,
  Download,
  RefreshCw 
} from "lucide-react";

// Mock data - expand the dataset
const mockReports: Report[] = [
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
  },
  {
    id: "4",
    title: "Bus stop shelter damaged",
    description: "The glass panel of the bus shelter is cracked and poses a safety risk to commuters.",
    category: "transport",
    status: "pending",
    priority: "medium",
    location: "Elm Street, City Center",
    submittedBy: "David Kim",
    submittedAt: "2024-01-12T08:20:00Z",
    upvotes: 8,
    comments: 1
  },
  {
    id: "5",
    title: "Noise complaint - Construction site",
    description: "Construction work starting before permitted hours (before 7 AM) disturbing residents.",
    category: "other",
    status: "investigating",
    priority: "low",
    location: "Pine Avenue, Residential Zone",
    submittedBy: "Emma Wilson",
    submittedAt: "2024-01-11T06:45:00Z",
    upvotes: 22,
    comments: 5
  },
  {
    id: "6",
    title: "Crosswalk signal malfunction",
    description: "Pedestrian crossing signal is not working properly, showing conflicting signals to cars and pedestrians.",
    category: "safety",
    status: "investigating",
    priority: "urgent",
    location: "Broadway & 5th Street",
    submittedBy: "James Rodriguez",
    submittedAt: "2024-01-10T14:30:00Z",
    upvotes: 35,
    comments: 12
  }
];

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || report.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const getStatusCount = (status: string) => {
    if (status === "all") return mockReports.length;
    return mockReports.filter(r => r.status === status).length;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Reports Management
          </h1>
          <p className="text-muted-foreground mt-2">
            View, filter, and manage all city reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "All Reports", value: "all", count: getStatusCount("all") },
          { label: "Pending", value: "pending", count: getStatusCount("pending") },
          { label: "Investigating", value: "investigating", count: getStatusCount("investigating") },
          { label: "Resolved", value: "resolved", count: getStatusCount("resolved") },
          { label: "Rejected", value: "rejected", count: getStatusCount("rejected") }
        ].map(({ label, value, count }) => (
          <Card 
            key={value}
            className={`cursor-pointer transition-all hover:scale-105 ${
              statusFilter === value ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setStatusFilter(value)}
          >
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search reports by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Active Filters */}
          {(statusFilter !== "all" || categoryFilter !== "all" || priorityFilter !== "all" || searchTerm) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="ml-1 hover:bg-secondary-foreground/20 rounded-full">
                    ×
                  </button>
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter("all")} className="ml-1 hover:bg-secondary-foreground/20 rounded-full">
                    ×
                  </button>
                </Badge>
              )}
              {categoryFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Category: {categoryFilter}
                  <button onClick={() => setCategoryFilter("all")} className="ml-1 hover:bg-secondary-foreground/20 rounded-full">
                    ×
                  </button>
                </Badge>
              )}
              {priorityFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Priority: {priorityFilter}
                  <button onClick={() => setPriorityFilter("all")} className="ml-1 hover:bg-secondary-foreground/20 rounded-full">
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {filteredReports.length} Report{filteredReports.length !== 1 ? 's' : ''} Found
          </h2>
        </div>
        
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reports found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReports.map((report) => (
              <ReportCard 
                key={report.id} 
                report={report}
                onView={(report) => console.log("View report:", report.id)}
                onUpvote={(id) => console.log("Upvote report:", id)}
                onComment={(id) => console.log("Comment on report:", id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}