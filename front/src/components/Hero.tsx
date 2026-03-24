import { Button } from "@/components/ui/button";
import { ArrowDown, Mail, Phone } from "lucide-react";
import ProjectInquiry from "@/components/ProjectInquiry";

const Hero = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full blur-3xl animate-float opacity-10 bg-primary" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full blur-3xl animate-float opacity-5 bg-primary" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Available for remote work</span>
          </div>

          {/* Main heading */}
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-slide-up">
            Hi, I'm{" "}
            <span className="text-gradient">Promise Shedrack</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Front-End Web Designer & Social Media Manager
          </p>

          {/* Description */}
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Crafting beautiful, responsive web experiences with modern technologies.
            Let's bring your digital vision to life.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <ProjectInquiry />
            <Button variant="heroOutline" size="xl" onClick={scrollToContact}>
              <Mail className="w-5 h-5" />
              Get In Touch
            </Button>
          </div>

          {/* Quick contact */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <a href="mailto:promiseshedrack02@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="w-4 h-4" />
              promiseshedrack02@gmail.com
            </a>
            <a href="tel:09126441023" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              09126441023
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <button onClick={scrollToAbout} className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
