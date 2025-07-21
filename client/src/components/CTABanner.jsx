import { Button } from "./ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CTABanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreateRoomClick = () => {
    if (user) {
      navigate("/create-room");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-12 lg:p-20 text-center relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent"></div>
            <div className="absolute top-20 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary"></div>
            <div className="absolute bottom-10 left-20 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent"></div>
            <div className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Ready to start your <span className="gradient-text">coding journey</span> with friends?
              </h2>
              <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-3xl mx-auto">
                Start your coding journey with friends — collaborate, compete, and grow together on CodeCircle Buddies.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-primary group text-lg px-8 py-4"
                onClick={handleCreateRoomClick}
              >
                {user ? "Create Your Room" : "Get Started"}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-border/20">
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">Crafted with care, driven by passion</p>
              <div className="flex justify-center items-center space-x-8 text-muted-foreground/60">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">100% Fun</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">100+ Coders Joined</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">Secure & Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-accent/5 to-primary/5 blur-3xl"></div>
      </div>
    </section>
  );
};

export default CTABanner;
