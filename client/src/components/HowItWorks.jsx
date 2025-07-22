import { UserPlus, MessageCircle, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create or Join a Room",
    description:
      "Start by creating a room or join an existing one with your friends to begin collaborating."
  },
  {
    number: "02",
    icon: MessageCircle,
    title: "Chat and Compete",
    description:
      "Discuss ideas in channels and take part in coding contests together."
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Track Progress",
    description:
      "See your growth on leaderboards and celebrate achievements as a team."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Get started in three simple steps and transform the way you code with friends.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center"
              >
                {/* Step Card */}
                <div
                  className="glass-card relative rounded-2xl p-6 sm:p-8 text-center group hover:scale-[1.03] transition-all duration-300 w-full h-full flex flex-col"
                  style={{ minHeight: "100%" }}
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mt-8 mb-6 flex justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-grow">
                      {step.description}
                    </p>
                  </div>

                  {/* Add some spacing at bottom to align buttons if needed */}
                  <div className="mt-4"></div>
                </div>

                {/* Arrow - Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-[-20px] translate-y-[-50%]">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                )}

                {/* Arrow - Mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-6">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
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
