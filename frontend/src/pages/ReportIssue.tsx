import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Upload, X, Camera } from 'lucide-react';
import api from '@/lib/api';

interface IssueFormData {
  title: string;
  description: string;
  category: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  media: File[];
}

export const ReportIssue = () => {
  const [formData, setFormData] = useState<IssueFormData>({
    title: '',
    description: '',
    category: '',
    location: { lat: 0, lng: 0 },
    address: '',
    media: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = [
    { value: 'pothole', label: 'Pothole', icon: '🕳️' },
    { value: 'garbage', label: 'Garbage/Waste', icon: '🗑️' },
    { value: 'streetlight', label: 'Street Light', icon: '💡' },
    { value: 'water', label: 'Water Issue', icon: '💧' },
    { value: 'other', label: 'Other', icon: '📋' }
  ];

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }));
        
        // Reverse geocoding to get address (you might want to use a proper service)
        setFormData(prev => ({
          ...prev,
          address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
        }));
        
        toast({
          title: "Location captured",
          description: "Your current location has been added to the report",
        });
        setIsGettingLocation(false);
      },
      (error) => {
        toast({
          title: "Location error",
          description: "Unable to get your location. Please enter address manually.",
          variant: "destructive",
        });
        setIsGettingLocation(false);
      }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxFiles = 5;
    
    if (formData.media.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can upload a maximum of ${maxFiles} files`,
        variant: "destructive",
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      media: [...prev.media, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if ((formData.location.lat === 0 && formData.location.lng === 0) && !formData.address) {
      toast({
        title: "Location required",
        description: "Please add a location for your issue report",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('lat', String(formData.location.lat));
      submitData.append('lng', String(formData.location.lng));
      submitData.append('address', formData.address);
      submitData.append('status', 'pending');
      
      formData.media.forEach((file, index) => {
        submitData.append('media', file);
      });

      const response = await api.post('/issue', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: "Issue reported successfully!",
        description: "Thank you for helping improve our community",
      });

      navigate('/issues');
    } catch (error: any) {
      toast({
        title: "Failed to report issue",
        description: error.response?.data?.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Report an Issue</h1>
        <p className="text-muted-foreground">
          Help improve your community by reporting problems you've noticed
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
          <CardDescription>
            Provide as much detail as possible to help us address the issue quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, category: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center space-x-2">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide more details about the issue..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <Label>Location *</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="h-auto p-4 flex-col space-y-2"
                >
                  <MapPin className="h-6 w-6" />
                  <span>{isGettingLocation ? "Getting location..." : "Use Current Location"}</span>
                </Button>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Or enter address</Label>
                  <Input
                    id="address"
                    placeholder="Street address or landmark"
                    value={formData.address}
                    onChange={(e) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        address: e.target.value,
                        // You might want to geocode this address to get lat/lng
                        location: prev.location.lat === 0 ? { lat: 0.1, lng: 0.1 } : prev.location
                      }));
                    }}
                  />
                </div>
              </div>
              
              {(formData.location.lat !== 0 || formData.address) && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Location set:</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.address || `${formData.location.lat.toFixed(4)}, ${formData.location.lng.toFixed(4)}`}
                  </p>
                </div>
              )}
            </div>

            {/* Media Upload */}
            <div className="space-y-4">
              <Label>Photos/Videos (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload photos or videos</p>
                    <p className="text-xs text-muted-foreground">
                      Maximum 5 files, 10MB each
                    </p>
                  </div>
                </label>
              </div>

              {/* File Preview */}
              {formData.media.length > 0 && (
                <div className="grid gap-2 md:grid-cols-2">
                  {formData.media.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm font-medium truncate">{file.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="hero"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Submitting..." : "Report Issue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};