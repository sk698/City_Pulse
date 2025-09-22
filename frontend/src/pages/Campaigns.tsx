import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Target, Sparkles, Users, Plus, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import type { Campaign } from '@/types';
import { Calendar } from '@/components/ui/calendar';

export const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    campaignName: '',
    description: '',
    campaignDate: '',
    pointsAddedAfterJoining: 0,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/campaign');
      setCampaigns(response.data.data);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await api.post('/campaign', { ...newCampaign, campaignStatus: 'upcoming' });
      
      toast({
        title: "Campaign created!",
        description: "Your campaign has been successfully created",
      });

      setIsCreateDialogOpen(false);
      setNewCampaign({ campaignName: '', description: '', campaignDate: '', pointsAddedAfterJoining: 0 });
      fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Failed to create campaign",
        description: error.response?.data?.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinCampaign = async (campaignId: string) => {
    try {
      const response = await api.post(`/campaign/${campaignId}/join`);
      const updatedCampaign = response.data.data;
      
      toast({
        title: "Joined campaign!",
        description: `You've successfully joined and earned ${updatedCampaign.pointsAddedAfterJoining} points!`,
      });

      fetchCampaigns(); 
    } catch (error: any) {
      toast({
        title: "Failed to join campaign",
        description: error.response?.data?.message || "Please try again later",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'upcoming': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{campaign.campaignName}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge
                className={`${getStatusColor(campaign.campaignStatus)} text-white border-0`}
                variant="secondary"
              >
                {campaign.campaignStatus}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                {campaign.participants.length} participants
              </div>
            </div>
          </div>
          <Target className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-3">
          {campaign.description}
        </p>

        <div className="space-y-2">
          {campaign.campaignDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Target: {new Date(campaign.campaignDate).toLocaleDateString()}
            </div>
          )}
          <div className="flex items-center text-sm font-semibold text-primary">
            <Star className="h-4 w-4 mr-2 fill-current" />
            {campaign.pointsAddedAfterJoining} Points
          </div>
        </div>

        <div className="pt-4">
          {(campaign.campaignStatus === 'upcoming' || campaign.campaignStatus === 'ongoing') && (
            <Button
              onClick={() => handleJoinCampaign(campaign._id)}
              variant="civic"
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Join Campaign
            </Button>
          )}
          
          {campaign.campaignStatus === 'completed' && (
            <Button variant="outline" className="w-full" disabled>
              Campaign Completed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const campaignDates = campaigns
    .filter(c => c.campaignDate)
    .map(c => new Date(c.campaignDate));

  const modifiers = {
    campaign: campaignDates,
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (!selectedDate) return true;
    if (!campaign.campaignDate) return false;
    const campaignDate = new Date(campaign.campaignDate);
    return campaignDate.toDateString() === selectedDate.toDateString();
  });

  if (isLoading) {
    return (
      <div>Loading Campaigns...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Campaigns</h1>
          <p className="text-muted-foreground">
            Join or create community-driven initiatives for positive change
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Start Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Start a community initiative to address local issues
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaignTitle">Campaign Title</Label>
                <Input
                  id="campaignTitle"
                  placeholder="e.g., Clean Up Central Park"
                  value={newCampaign.campaignName}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, campaignName: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaignDesc">Description</Label>
                <Textarea
                  id="campaignDesc"
                  placeholder="Describe your campaign goals and activities..."
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignDate">Target Date</Label>
                  <Input
                    id="campaignDate"
                    type="date"
                    value={newCampaign.campaignDate}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, campaignDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignPoints">Points</Label>
                  <Input
                    id="campaignPoints"
                    type="number"
                    value={newCampaign.pointsAddedAfterJoining}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, pointsAddedAfterJoining: parseInt(e.target.value, 10) || 0 }))}
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="hero"
                  disabled={isCreating}
                  className="flex-1"
                >
                  {isCreating ? "Creating..." : "Create Campaign"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={modifiers}
                modifiersClassNames={{
                  campaign: 'day-campaign',
                }}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {selectedDate ? `Campaigns on ${selectedDate.toLocaleDateString()}` : "All Campaigns"}
            </h2>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {filteredCampaigns.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No campaigns found</h3>
                  <p className="text-muted-foreground">
                    {selectedDate ? "There are no campaigns scheduled for this date." : "Be the first to start a campaign!"}
                  </p>
                </div>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <CampaignCard key={campaign._id} campaign={campaign} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};