import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Globe, Image, Home, Zap, ShoppingCart, BarChart2, Palette, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    title: "Shortlet Booking Platform",
    description:
      "A fully responsive shortlet accommodation website with property listings, booking system, and interactive gallery. Built with modern UI/UX principles to maximize conversions.",
    tags: ["React", "Tailwind CSS", "JavaScript", "REST API"],
    icon: Home,
    color: "#f97316",
    gradient: "from-orange-500/20 to-amber-500/10",
    category: "Web App",
    featured: true,
  },
  {
    id: 2,
    title: "AI Image Upscaler",
    description:
      "A powerful image enhancement tool leveraging AI to upscale images up to 4x resolution without quality loss. Drag-and-drop interface with real-time preview.",
    tags: ["JavaScript", "CSS3", "AI API", "Canvas API"],
    icon: Image,
    color: "#3b82f6",
    gradient: "from-blue-500/20 to-cyan-500/10",
    category: "Tool",
    featured: true,
  },
  {
    id: 3,
    title: "Brand Portfolio Website",
    description:
      "A sleek, animated portfolio website for a creative agency with smooth scroll animations, parallax effects, and a stunning dark theme with neon accents.",
    tags: ["HTML5", "CSS3", "JavaScript", "GSAP"],
    icon: Palette,
    color: "#8b5cf6",
    gradient: "from-violet-500/20 to-purple-500/10",
    category: "Website",
    featured: false,
  },
  {
    id: 4,
    title: "E-Commerce Dashboard",
    description:
      "A feature-rich admin dashboard for an e-commerce platform with real-time analytics, order management, inventory tracking, and customer insights.",
    tags: ["React", "TypeScript", "Recharts", "Tailwind"],
    icon: BarChart2,
    color: "#10b981",
    gradient: "from-emerald-500/20 to-teal-500/10",
    category: "Dashboard",
    featured: false,
  },
  {
    id: 5,
    title: "Lightning Fast Landing Page",
    description:
      "A high-converting SaaS landing page with 98+ Lighthouse score, micro-animations, testimonials carousel, and integrated contact forms.",
    tags: ["HTML5", "CSS3", "Bootstrap", "JavaScript"],
    icon: Zap,
    color: "#eab308",
    gradient: "from-yellow-500/20 to-amber-500/10",
    category: "Landing Page",
    featured: false,
  },
  {
    id: 6,
    title: "Online Store Frontend",
    description:
      "A complete e-commerce storefront with product filtering, cart management, wishlist, and seamless checkout flow. Mobile-first responsive design.",
    tags: ["React", "Tailwind CSS", "Context API", "TypeScript"],
    icon: ShoppingCart,
    color: "#ec4899",
    gradient: "from-pink-500/20 to-rose-500/10",
    category: "E-Commerce",
    featured: false,
  },
];

const categories = ["All", "Web App", "Tool", "Website", "Dashboard", "Landing Page", "E-Commerce"];

const ProjectCard = ({ project, index, isVisible }: {
  project: typeof projects[0];
  index: number;
  isVisible: boolean;
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={cardRef}
      className={`group relative transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
    >
      <div
        className="relative h-full rounded-2xl bg-card border border-border overflow-hidden transition-all duration-200 ease-out"
        style={{
          transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
          boxShadow: mousePos.x !== 0
            ? `${-mousePos.x * 2}px ${mousePos.y * 2}px 40px ${project.color}20`
            : "none",
        }}
      >
        {/* Gradient header */}
        <div
          className={`relative h-44 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}
        >
          {/* Animated circles */}
          <div className="absolute inset-0 overflow-hidden">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border opacity-20"
                style={{
                  width: `${i * 120}px`,
                  height: `${i * 120}px`,
                  borderColor: project.color,
                  right: `-${i * 20}px`,
                  top: `${(i - 1) * 20 - 30}px`,
                  animation: `spin ${10 + i * 5}s linear infinite`,
                }}
              />
            ))}
          </div>

          {/* Category badge */}
          <span
            className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: `${project.color}20`, color: project.color, border: `1px solid ${project.color}40` }}
          >
            {project.category}
          </span>

          {/* Featured badge */}
          {project.featured && (
            <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-primary text-primary-foreground">
              ⭐ Featured
            </span>
          )}

          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            style={{
              background: `${project.color}25`,
              border: `2px solid ${project.color}40`,
              boxShadow: `0 0 20px ${project.color}30`,
            }}
          >
            <project.icon className="w-8 h-8" style={{ color: project.color }} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-heading text-lg font-bold mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground border border-border"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-2 hover:border-primary/50 hover:text-primary transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              Code
            </Button>
            <Button
              size="sm"
              className="flex-1 gap-2"
              style={{ background: project.color }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Demo
            </Button>
          </div>
        </div>

        {/* Bottom glow on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
        />
      </div>
    </div>
  );
};

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" ref={sectionRef} className="py-32 bg-card relative overflow-hidden">
      <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 top-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4">
              <span className="w-8 h-px bg-primary" />
              Portfolio
              <span className="w-8 h-px bg-primary" />
            </span>
            <h2 className="font-heading text-4xl md:text-6xl font-black mt-2">
              Featured{" "}
              <span style={{
                background: "linear-gradient(135deg, #f97316, #fdba74)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Projects
              </span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
              A selection from 50+ projects. Each built with care, creativity, and clean code.
            </p>
          </div>

          {/* Category filter */}
          <div
            className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "0.2s" }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* View more */}
          <div
            className={`text-center mt-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "0.8s" }}
          >
            <a href="https://github.com/promiseshedrack02" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="gap-2 hover:border-primary/50 hover:text-primary">
                <Github className="w-5 h-5" />
                View All Projects on GitHub
              </Button>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default Projects;