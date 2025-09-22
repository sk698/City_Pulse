import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MapPin,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Sparkles,
  Loader2,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import api from '@/lib/api';
import type { Issue, AIVerification } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export const IssueDetails = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchIssue = async () => {
      if (!issueId) return;
      setIsLoading(true);
      try {
        const response = await api.get(`/issue/${issueId}`);
        setIssue(response.data.data);
      } catch (error) {
        console.error('Failed to fetch issue:', error);
        toast({
          title: "Error",
          description: "Could not load the issue details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssue();
  }, [issueId, toast]);

  const handleAIVerify = async () => {
    if (!issueId) return;
    setVerifying(true);
    try {
      await api.post(`/ai/${issueId}`);
      const response = await api.get<{ data: AIVerification }>(`/ai/${issueId}`);
      const aiResult = response.data.data;

      setIssue(prevIssue => prevIssue ? { ...prevIssue, aiVerification: aiResult } : null);
      toast({ title: "AI Verification Complete" });
    } catch (error) {
      toast({ title: "AI Verification Failed", variant: "destructive" });
    } finally {
      setVerifying(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    // ... same as in Issues.tsx
    switch (status) {
        case 'resolved': return 'bg-green-500';
        case 'in_progress': return 'bg-blue-500';
        case 'verified': return 'bg-yellow-500';
        case 'pending': return 'bg-orange-500';
        case 'rejected': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div>Loading Issue Details...</div>;
  }

  if (!issue) {
    return <div>Issue not found.</div>;
  }
  
  const aiData = issue.aiVerification;

  return (
    <div className="space-y-6">
      <Link to="/issues" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to all issues
      </Link>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-3xl">{issue.title}</CardTitle>
                <Badge className={cn(getStatusColor(issue.status), "text-white border-0")}>
                  {issue.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{issue.description}</p>
              {/* Media gallery would go here */}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <Badge variant="outline" className="capitalize">{issue.category}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reported On</span>
                <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Location</span>
                <span className="text-right">{issue.address}</span>
              </div>
            </CardContent>
          </Card>

          {issue.reportedBy && (
            <Card>
              <CardHeader><CardTitle>Reported By</CardTitle></CardHeader>
              <CardContent className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={issue.reportedBy.avatar} />
                  <AvatarFallback>{issue.reportedBy.fullName ? issue.reportedBy.fullName.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{issue.reportedBy.fullName || "Unknown User"}</p>
                  <p className="text-xs text-muted-foreground">Community Member</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>AI Verification</CardTitle></CardHeader>
            <CardContent>
              {aiData ? (
                <div className={cn(
                  "space-y-3 p-3 rounded-md border",
                  aiData.verified ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
                )}>
                  <div className="flex items-center space-x-2">
                    {aiData.verified ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                    <p className="font-semibold text-sm">{aiData.verified ? "AI: Issue Verified" : "AI: Verification Failed"}</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1"><Label className="text-xs">Confidence</Label><span className="text-xs font-medium">{Math.round(aiData.confidenceScore)}%</span></div>
                    <Progress value={aiData.confidenceScore} className="h-2" />
                  </div>
                  {aiData.duplicateOf && (
                    <div className="flex items-center space-x-2 p-2 bg-yellow-500/10 rounded-md text-yellow-700">
                      <AlertTriangle className="h-4 w-4" />
                      <p className="text-xs font-medium">Possible duplicate of <Link to={`/issues/${aiData.duplicateOf}`} className="underline">issue #{aiData.duplicateOf.slice(-6)}</Link></p>
                    </div>
                  )}
                </div>
              ) : (
                <Button variant="outline" className="w-full" onClick={handleAIVerify} disabled={verifying}>
                  {verifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
                  {verifying ? 'Analyzing...' : 'Verify with AI'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};