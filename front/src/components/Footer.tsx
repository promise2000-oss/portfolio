import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://x.com/Promiseshed02",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/promise-chuks-5b22342b2?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/promise2000-oss",
    },
  ];

  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Name */}
          <h3 className="font-heading text-2xl font-bold text-gradient mb-4">
            Promise Shedrack
          </h3>

          <p className="text-muted-foreground mb-8">
            Front-End Web Designer & Social Media Manager
          </p>

          {/* Social links */}
          <div className="flex justify-center gap-4 mb-8">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} Promise Shedrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
