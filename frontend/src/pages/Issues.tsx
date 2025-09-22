import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress'; // New import
import { 
  MapPin, 
  Search, 
  Filter,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  XCircle, // New icon
  Sparkles,
  Loader2,
  AlertTriangle // New icon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import type { Issue, AIVerification } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export const Issues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verifyingIssueId, setVerifyingIssueId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const [allIssuesRes, myIssuesRes] = await Promise.all([
          api.get('/issue'),
          api.get('/users/issue')
        ]);
        setIssues(allIssuesRes.data.data);
        setMyIssues(myIssuesRes.data.data);
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, []);
  
  const handleAIVerify = async (issueId: string, tab: 'all' | 'my') => {
    setVerifyingIssueId(issueId);
    try {
      await api.post(`/ai/${issueId}`);
      const response = await api.get<{ data: AIVerification }>(`/ai/${issueId}`);
      const aiResult = response.data.data;

      const updateState = (prevState: Issue[]) => prevState.map(issue => 
        issue._id === issueId ? { ...issue, aiVerification: aiResult } : issue
      );

      if (tab === 'all') setIssues(updateState);
      else setMyIssues(updateState);

      toast({ title: "AI Verification Complete" });
    } catch (error) {
      toast({ title: "AI Verification Failed", variant: "destructive" });
    } finally {
      setVerifyingIssueId(null);
    }
  };
  
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

  const filterIssues = (issuesList: Issue[]) => {
    return issuesList.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (issue.description && issue.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = issue.status === 'pending';
      const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  };

  const IssueCard = ({ issue, tab }: { issue: Issue; tab: 'all' | 'my' }) => {
    const aiData = issue.aiVerification;
  
    return (
      <Card className="hover:shadow-md transition-shadow flex flex-col">
        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Issue Title, Description, Status */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{getCategoryIcon(issue.category)}</div>
                <div>
                  <h3 className="font-semibold text-lg">{issue.title}</h3>
                  <p className="text-muted-foreground mt-1 line-clamp-2">{issue.description || 'No description'}</p>
                </div>
              </div>
              <Badge className={cn(getStatusColor(issue.status), "text-white border-0")}>{issue.status.replace('_', ' ')}</Badge>
            </div>
  
            {/* Reporter Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{issue.address || `${issue.location.lat.toFixed(4)}, ${issue.location.lng.toFixed(4)}`}</div>
              <div className="flex items-center"><User className="h-4 w-4 mr-2" />Reported by {issue.reportedBy.fullName}</div>
              <div className="flex items-center"><Clock className="h-4 w-4 mr-2" />{new Date(issue.createdAt).toLocaleDateString()}</div>
            </div>
            
            <div className="flex-1" />
  
            {/* AI Verification Section */}
            <div className="pt-2">
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
                    <div className="flex justify-between items-center mb-1">
                      <Label className="text-xs">Confidence</Label>
                      <span className="text-xs font-medium">{Math.round(aiData.confidenceScore)}%</span>
                    </div>
                    <Progress value={aiData.confidenceScore} className="h-2" />
                  </div>
  
                  {aiData.duplicateOf && (
                    <div className="flex items-center space-x-2 p-2 bg-yellow-500/10 rounded-md text-yellow-700">
                      <AlertTriangle className="h-4 w-4" />
                      <p className="text-xs font-medium">Possible duplicate of issue <Link to={`/issues/${aiData.duplicateOf}`} className="underline">#{aiData.duplicateOf.slice(-6)}</Link></p>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleAIVerify(issue._id, tab)}
                  disabled={verifyingIssueId === issue._id}
                >
                  {verifyingIssueId === issue._id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
                  {verifyingIssueId === issue._id ? 'Analyzing...' : 'Verify with AI'}
                </Button>
              )}
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <Badge variant="outline" className="capitalize">{issue.category}</Badge>
              <Link to={`/issues/${issue._id}`}>
                <Button variant="outline" size="sm"><MessageSquare className="h-4 w-4 mr-2" />View Details</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Loading and main return JSX remains the same
  if (isLoading) { return <div>Loading issues...</div>; }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Issues</h1>
          <p className="text-muted-foreground">Track and engage with issues in your community</p>
        </div>
        <Link to="/report"><Button variant="hero">Report New Issue</Button></Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="Search issues..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="pothole">Potholes</SelectItem>
                <SelectItem value="garbage">Garbage</SelectItem>
                <SelectItem value="streetlight">Street Lights</SelectItem>
                <SelectItem value="water">Water Issues</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}><Filter className="h-4 w-4 mr-2" />Clear Filters</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all">All Issues</TabsTrigger>
          <TabsTrigger value="my">My Issues</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterIssues(issues).length === 0 ? <div className="col-span-full text-center py-12"><div className="text-6xl mb-4">🔍</div><h3 className="text-xl font-semibold mb-2">No pending issues found</h3><p className="text-muted-foreground">Try adjusting your search terms or filters</p></div> : filterIssues(issues).map((issue) => (<IssueCard key={issue._id} issue={issue} tab="all" />))}
          </div>
        </TabsContent>
        <TabsContent value="my" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterIssues(myIssues).length === 0 ? <div className="col-span-full text-center py-12"><div className="text-6xl mb-4">📝</div><h3 className="text-xl font-semibold mb-2">No pending issues reported yet</h3><p className="text-muted-foreground mb-4">Start making a difference by reporting your first issue</p><Link to="/report"><Button variant="hero">Report Your First Issue</Button></Link></div> : filterIssues(myIssues).map((issue) => (<IssueCard key={issue._id} issue={issue} tab="my" />))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};