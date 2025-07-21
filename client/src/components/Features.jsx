import { Users, Trophy, MessageSquare, Gamepad2 } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Private Rooms with Friends",
    description: "Create exclusive coding spaces for your team. Invite friends and collaborate in a private environment tailored to your group's needs."
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    description: "Track progress with room-specific leaderboards based on LeetCode ratings. Watch your team grow and celebrate achievements together."
  },
  {
    icon: MessageSquare,
    title: "Channels for Chat",
    description: "Organize discussions with dedicated channels. Share ideas, ask questions, and stay connected with your coding community."
  },
  {
    icon: Gamepad2,
    title: "Host Contests",
    description: "Room admins can create exciting coding contests. Engage members with challenges and view results and analytics."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            What makes <span className="gradient-text">CodeCircle Buddies</span> unique
          </h2>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-3xl mx-auto">
            Discover the powerful features that make collaborative coding enjoyable and productive for teams of all sizes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="glass-card rounded-2xl p-8 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect Line */}
              <div className="mt-6 h-1 w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
