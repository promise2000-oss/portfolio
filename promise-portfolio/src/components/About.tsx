const About = () => {
  return (
    <section id="about" className="py-24 bg-card relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">About Me</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mt-2">
              Passionate About Creating
            </h2>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image/Visual placeholder */}
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-card border border-border overflow-hidden shadow-card">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                      <span className="text-5xl font-heading font-bold text-primary-foreground">PS</span>
                    </div>
                    <p className="text-muted-foreground">Creative Developer</p>
                  </div>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-2xl -z-10" />
            </div>

            {/* Text content */}
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm a dedicated remote front-end web designer with a passion for creating 
                visually stunning and user-friendly websites. Working remotely allows me to 
                collaborate with clients worldwide, bringing flexibility and focus to every project.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Beyond web design, I'm also a skilled social media manager, helping 
                brands build their online presence and connect with their audience 
                through strategic content and engagement.
              </p>
              <div className="pt-4">
                <h3 className="font-heading text-xl font-semibold mb-4">What I Do</h3>
                <ul className="space-y-3">
                  {[
                    "Responsive Web Design",
                    "UI/UX Implementation",
                    "Social Media Strategy",
                    "Brand Development",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
