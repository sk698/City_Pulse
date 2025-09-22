import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, MessageSquare, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/city-pulse-hero.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              City Pulse
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering communities through smart civic engagement. Report issues, 
              join campaigns, and make your voice heard in shaping your city's future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How City Pulse Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to make a difference in your community
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center border-primary/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Report Issues</h3>
                <p className="text-muted-foreground">
                  Spot a pothole? Broken streetlight? Report civic issues with photos and location data.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-secondary/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Join Campaigns</h3>
                <p className="text-muted-foreground">
                  Participate in community-driven initiatives and collaborative improvement projects.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-accent/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                <p className="text-muted-foreground">
                  See real-time updates on issue resolution and community impact metrics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Ready to Make a Difference?</h2>
            <p className="text-muted-foreground">
              Join thousands of engaged citizens using City Pulse to improve their communities.
            </p>
            <Link to="/register">
              <Button variant="hero" size="lg">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
