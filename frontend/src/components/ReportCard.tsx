import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; 
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Calendar, 
  User, 
  Eye,
  MessageCircle,
  ThumbsUp
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Report {
  id: string;
  title: string;
  description: string;
  category: "infrastructure" | "environment" | "safety" | "transport" | "other";
  status: "pending" | "investigating" | "resolved" | "rejected";
  priority: "low" | "medium" | "high" | "urgent";
  location: string;
  submittedBy: string;
  submittedAt: string;
  image?: string;
  upvotes: number;
  comments: number;
}

interface ReportCardProps {
  report: Report;
  onView?: (report: Report) => void;
  onUpvote?: (reportId: string) => void;
  onComment?: (reportId: string) => void;
}

const categoryColors = {
  infrastructure: "bg-blue-100 text-blue-800 border-blue-200",
  environment: "bg-green-100 text-green-800 border-green-200", 
  safety: "bg-red-100 text-red-800 border-red-200",
  transport: "bg-purple-100 text-purple-800 border-purple-200",
  other: "bg-gray-100 text-gray-800 border-gray-200"
};

const priorityColors = {
  low: "bg-gray-100 text-gray-600 border-gray-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  high: "bg-orange-100 text-orange-700 border-orange-200", 
  urgent: "bg-red-100 text-red-700 border-red-200"
};

export function ReportCard({ report, onView, onUpvote, onComment }: ReportCardProps) {
  const getStatusClassName = () => {
    switch (report.status) {
      case "pending":
        return "status-pending";
      case "investigating":
        return "status-investigating";  
      case "resolved":
        return "status-resolved";
      case "rejected":
        return "status-rejected";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <Card className="hover-lift">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h3 className="font-semibold text-lg leading-tight">
              {report.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="outline" 
                className={categoryColors[report.category]}
              >
                {report.category}
              </Badge>
              <Badge 
                variant="outline"
                className={priorityColors[report.priority]}
              >
                {report.priority} priority
              </Badge>
              <Badge 
                variant="outline"
                className={cn("border", getStatusClassName())}
              >
                {report.status}
              </Badge>
            </div>
          </div>
          {report.image && (
            <div className="flex-shrink-0">
              <img 
                src={report.image} 
                alt="Report"
                className="w-16 h-16 rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {report.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{report.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{report.submittedBy}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(report.submittedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpvote?.(report.id)}
              className="gap-2 text-muted-foreground hover:text-primary"
            >
              <ThumbsUp className="h-4 w-4" />
              {report.upvotes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(report.id)}
              className="gap-2 text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" />
              {report.comments}
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(report)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}