import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import type { User } from '@/types';
import { Loader2 } from 'lucide-react';

export const ManageAccount = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [profileData, setProfileData] = useState({ fullName: '', email: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/users/current-user');
        setUser(response.data.data);
        setProfileData({
          fullName: response.data.data.fullName,
          email: response.data.data.email,
        });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch user data.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [toast]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await api.patch('/users/update-account', profileData);
      setUser(response.data.data);
      toast({ title: 'Success', description: 'Profile updated successfully.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to update profile.', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: 'Error', description: 'New passwords do not match.', variant: 'destructive' });
      return;
    }
    setIsUpdating(true);
    try {
      await api.post('/users/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      toast({ title: 'Success', description: 'Password changed successfully.' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to change password.', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setIsUpdating(true);
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    try {
      const response = await api.patch('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(response.data.data);
      toast({ title: 'Success', description: 'Avatar updated successfully.' });
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to update avatar.', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div>Loading account details...</div>;
  if (!user) return <div>Could not load user details.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Account</h1>
        <p className="text-muted-foreground">Update your profile and account settings.</p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={profileData.fullName} onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
                </div>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Choose a new, strong password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Current Password</Label>
                  <Input id="oldPassword" type="password" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}/>
                </div>
                <Button type="submit" disabled={isUpdating}>
                   {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avatar">
          <Card>
            <CardHeader>
              <CardTitle>Update Avatar</CardTitle>
              <CardDescription>Upload a new profile picture.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview || user.avatar} />
                  <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <Input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="max-w-xs" />
              </div>
              <Button onClick={handleAvatarUpload} disabled={!avatarFile || isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload New Avatar
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};