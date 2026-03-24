import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Building2,
  Briefcase,
  MapPin,
  Loader2,
} from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  company: string | null;
  position: string | null;
  avatar_url: string | null;
  rating: number;
  title: string;
  message: string;
  project_type: string | null;
  created_at: string;
}

interface TestimonialStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

const API_URL = "http://localhost:5000/api";

const Testimonials = () => {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<TestimonialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    position: "",
    rating: 5,
    title: "",
    message: "",
    project_type: "",
  });

  useEffect(() => {
    fetchTestimonials();
    fetchStats();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_URL}/testimonials?limit=20`);
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      // Set fallback testimonials if API fails
      setTestimonials([
        {
          id: 1,
          name: "Chukwuemeka Okafor",
          company: "Lagos Tech Ventures",
          position: "Founder & CEO",
          avatar_url: null,
          rating: 5,
          title: "A True Professional Who Delivers Excellence",
          message: "Working with Promise was an absolute game-changer for our startup. He built our entire e-commerce platform from scratch, and the attention to detail was remarkable. The site loads fast, looks stunning on all devices, and our conversion rate increased by 40% within the first month.",
          project_type: "E-commerce Platform",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Sarah Mitchell",
          company: "London Digital Studios",
          position: "Product Manager",
          avatar_url: null,
          rating: 5,
          title: "Outstanding Remote Collaboration Experience",
          message: "Working with Promise from London was seamless despite the time difference. He built a complex dashboard for our marketing analytics, and the quality rivaled what we'd expect from local agencies at a fraction of the cost. His communication was excellent.",
          project_type: "Analytics Dashboard",
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          name: "Fatima Abdullahi",
          company: "Abuja Digital Agency",
          position: "Creative Director",
          avatar_url: null,
          rating: 5,
          title: "Transformed Our Vision Into Reality",
          message: "I had a very specific vision for our agency's website, and Promise brought it to life perfectly. He understood our brand identity and created something that truly represents who we are. The animations are smooth, the user experience is intuitive.",
          project_type: "Corporate Website",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/testimonials/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      // Set fallback stats
      setStats({
        totalReviews: 10,
        averageRating: 4.8,
        ratingDistribution: { 5: 7, 4: 3, 3: 0, 2: 0, 1: 0 },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.title.trim() || !formData.message.trim()) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Thank you for your testimonial!",
          description: "Your review will be published after moderation.",
        });
        setShowForm(false);
        setFormData({
          name: "",
          email: "",
          company: "",
          position: "",
          rating: 5,
          title: "",
          message: "",
          project_type: "",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Failed to submit testimonial",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
        onClick={() =>
          interactive && setFormData((prev) => ({ ...prev, rating: i + 1 }))
        }
      />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getLocation = (company: string) => {
    const locations = {
      "Lagos Tech Ventures": "Lagos, Nigeria",
      "Abuja Digital Agency": "Abuja, Nigeria",
      "Ibadan Healthcare Solutions": "Ibadan, Nigeria",
      "Enugu Fashion House": "Enugu, Nigeria",
      "Kano Agro-Allied Ltd": "Kano, Nigeria",
      "London Digital Studios": "London, UK",
      "New York Startup Hub": "New York, USA",
      "Dubai Real Estate Group": "Dubai, UAE",
      "Singapore Tech Innovations": "Singapore",
      "Ghana Fintech Solutions": "Accra, Ghana",
    };
    return locations[company] || "Nigeria";
  };

  if (loading) {
    return (
      <section id="testimonials" className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Client Testimonials</h2>
            <p className="text-muted-foreground mt-4">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-primary" />
            Trusted by Clients Worldwide
          </div>
          <h2 className="text-4xl font-bold mb-4">What Clients Say About Me</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real feedback from real clients across Nigeria and around the world
          </p>

          {/* Stats Cards */}
          {stats && (
            <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
              <div className="bg-card border rounded-2xl p-6 shadow-sm min-w-[180px]">
                <div className="text-5xl font-bold text-primary mb-2">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Average Rating
                </div>
              </div>
              <div className="bg-card border rounded-2xl p-6 shadow-sm min-w-[180px]">
                <div className="text-5xl font-bold text-primary mb-2">
                  {stats.totalReviews}+
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Happy Clients
                </div>
                <div className="flex items-center justify-center gap-1 text-green-500 text-sm">
                  <Star className="w-4 h-4 fill-green-500" />
                  95% Satisfaction
                </div>
              </div>
              <div className="bg-card border rounded-2xl p-6 shadow-sm min-w-[180px]">
                <div className="text-5xl font-bold text-primary mb-2">5+
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Countries Served
                </div>
                <div className="flex items-center justify-center gap-1 text-blue-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  Global Reach
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Testimonials Carousel */}
        {testimonials.length > 0 ? (
          <div className="relative mb-12">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <Card className="max-w-3xl mx-auto border-0 shadow-xl bg-card/80 backdrop-blur">
                      <CardContent className="p-8 md:p-10">
                        <div className="flex items-start gap-6">
                          {/* Avatar */}
                          <div className="hidden sm:flex flex-shrink-0">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center font-bold text-xl shadow-lg">
                              {getInitials(testimonial.name)}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            {/* Quote Icon */}
                            <Quote className="w-10 h-10 text-primary/20 mb-4" />
                            
                            {/* Title */}
                            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-foreground">
                              {testimonial.title}
                            </h3>
                            
                            {/* Message */}
                            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                              "{testimonial.message}"
                            </p>
                            
                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                              {renderStars(testimonial.rating)}
                              <span className="text-sm text-muted-foreground ml-2">
                                {testimonial.rating}.0 out of 5
                              </span>
                            </div>
                            
                            {/* Author Info */}
                            <div className="flex items-center gap-4 pt-4 border-t">
                              <div className="sm:hidden">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center font-semibold text-sm">
                                  {getInitials(testimonial.name)}
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold text-foreground">
                                  {testimonial.name}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                  {testimonial.position && (
                                    <span className="flex items-center gap-1">
                                      <Briefcase className="w-3 h-3" />
                                      {testimonial.position}
                                    </span>
                                  )}
                                  {testimonial.company && (
                                    <span className="flex items-center gap-1">
                                      <Building2 className="w-3 h-3" />
                                      {testimonial.company}
                                    </span>
                                  )}
                                  {testimonial.company && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {getLocation(testimonial.company)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Project Type Badge */}
                            {testimonial.project_type && (
                              <div className="mt-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                  {testimonial.project_type}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            {testimonials.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 rounded-full shadow-lg bg-background/80 backdrop-blur hover:bg-background"
                  onClick={prevTestimonial}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 rounded-full shadow-lg bg-background/80 backdrop-blur hover:bg-background"
                  onClick={nextTestimonial}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-8">
                  {testimonials.slice(0, 10).map((_, index) => (
                    <button
                      key={index}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        index === currentIndex
                          ? "bg-primary w-6"
                          : "bg-primary/30 hover:bg-primary/50"
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No testimonials yet.</p>
          </div>
        )}

        {/* Add Review Button */}
        <div className="text-center">
          <Button onClick={() => setShowForm(true)} size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Leave a Review
          </Button>
        </div>

        {/* Testimonial Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Leave a Review</h3>
                    <p className="text-sm text-muted-foreground">Share your experience working with me</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowForm(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Email (optional)</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Company
                      </label>
                      <Input
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Position
                      </label>
                      <Input
                        value={formData.position}
                        onChange={(e) =>
                          setFormData({ ...formData, position: e.target.value })
                        }
                        placeholder="Your role"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 mt-2">
                      {renderStars(formData.rating, true)}
                      <span className="ml-2 text-sm text-muted-foreground font-medium">
                        {formData.rating}/5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Review Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Great experience working together!"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Your Review <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Share your experience working with me..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Project Type</label>
                    <Input
                      value={formData.project_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          project_type: e.target.value,
                        })
                      }
                      placeholder="e.g., Website, Mobile App, E-commerce"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
