import { UserPlus, MessageCircle, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create or Join a Room",
    description: "Start your journey by creating a new room or joining an existing one with friends."
  },
  {
    number: "02",
    icon: MessageCircle,
    title: "Chat and Compete",
    description: "Engage with your team through channels and participate in coding challenges together."
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your growth on leaderboards and celebrate achievements with your coding buddies."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Get started in three simple steps and transform the way you code with friends.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Step Card */}
                <div className="glass-card rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mt-8 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="h-10 w-10 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold mb-4 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-6 z-10">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                )}

                {/* Arrow - Mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-6">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-accent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;