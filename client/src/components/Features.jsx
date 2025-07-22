import { Users, Trophy, MessageSquare, Gamepad2 } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Private Rooms with Friends",
    description:
      "Build your own coding rooms or join existing ones with friends. Each room offers a dedicated space to collaborate, learn, and grow together."
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    description:
      "Compete with your friends through dynamic leaderboards powered by real‑time LeetCode ratings."
  },
  {
    icon: MessageSquare,
    title: "Multi‑Channel Discussions",
    description:
      "Stay organized with topic‑specific chat channels inside each room. Share insights and keep conversations focused."
  },
  {
    icon: Gamepad2,
    title: "Host Contests",
    description:
      "Room admins can design and launch coding contests exclusively for members. Engage your community with challenges."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 px-2">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            What makes <span className="gradient-text">CodeCircle Buddies</span> unique
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-3xl mx-auto">
            Discover the powerful features that make collaborative coding enjoyable and productive for teams of all sizes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-2xl p-6 sm:p-8 group transition-transform hover:scale-[1.02]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="mb-5 sm:mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect Line */}
              <div className="mt-5 h-1 w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
