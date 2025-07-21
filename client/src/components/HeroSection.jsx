import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import dashboardMockup from "../assets/dashboard-mockup.png";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJoinRoomClick = () => {
    if (user) {
      navigate("/rooms");
    } else {
      navigate("/login");
    }
  };

  const handleDashboardClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="gradient-text">Code Together,</span>
                <br />
                <span className="text-foreground">Build Friendships.</span>
              </h1>
              <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl">
                Create rooms, chat in channels, compete on leaderboards, and grow your skills with friends in our collaborative coding platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="btn-primary group"
                onClick={handleJoinRoomClick}
              >
                Join Rooms
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-secondary group"
                onClick={handleDashboardClick}
              >
                <Play className="mr-2 h-5 w-5" />
                Explore Dashboard
              </Button>
            </div>

            {/* Stats */}
            <div className="flex space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">100+</div>
                <div className="text-sm text-muted-foreground">Coders Welcome</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">0</div>
                <div className="text-sm text-muted-foreground">Barriers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">100%</div>
                <div className="text-sm text-muted-foreground">Creativity</div>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Mockup */}
          <div className="relative">
            <div className="floating-animation">
              <div className="glass-card rounded-2xl p-4 relative overflow-hidden">
                <img 
                  src={dashboardMockup} 
                  alt="CodeCircle Buddies Dashboard" 
                  className="w-full h-auto rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br from-accent to-primary opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-accent/10 to-primary/10 blur-3xl"></div>
      </div>
    </section>
  );
};

export default HeroSection;
