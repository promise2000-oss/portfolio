const skills = [
  { name: "HTML",    color: "hsl(16, 85%, 60%)" },
  { name: "CSS",  color: "hsl(200, 85%, 55%)" },
  { name: "Bootstrap",  color: "hsl(260, 75%, 55%)" },
  { name: "Tailwind CSS",  color: "hsl(180, 65%, 45%)" },
  { name: "JavaScript",  color: "hsl(50, 90%, 50%)" },
  { name: "TypeScript",  color: "hsl(210, 80%, 55%)" },
];

const Skills = () => {
  return (
    <section id="skills" className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Skills</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mt-2">
              Technologies I Work With
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              My toolkit for building beautiful, responsive, and performant web applications.
            </p>
          </div>

          {/* Skills grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors">
                    {skill.name}
                  </h3>
                  {/* <span className="text-sm text-muted-foreground">{skills}</span> */}
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      // width: `${skill.level}%`,
                      background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Additional skills tags */}
          <div className="mt-16 text-center">
            <h3 className="font-heading text-xl font-semibold mb-6">Also experienced with</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {["Git", "GitHub", "Responsive Design", "SEO", "Figma", "Social Media Marketing", "Content Strategy", "Brand Management"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm border border-border hover:border-primary/50 hover:text-primary transition-all cursor-default"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
