import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Bell, CheckCircle, Loader2 } from "lucide-react";

const API_URL = "http://localhost:5000/api";

const Newsletter = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Please enter a valid email",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubscribed(true);
        toast({
          title: "Successfully subscribed!",
          description: "Thank you for subscribing to my newsletter.",
        });
        setEmail("");
        setName("");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">You're Subscribed!</h2>
          <p className="text-primary-foreground/80">
            Thank you for subscribing. You'll receive updates about new projects,
            tips, and more.
          </p>
          <Button
            variant="secondary"
            className="mt-6"
            onClick={() => setIsSubscribed(false)}
          >
            Subscribe another email
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Stay Updated</h2>
            </div>
            <p className="text-primary-foreground/80">
              Subscribe to my newsletter for the latest updates, tech tips,
              project showcases, and exclusive content delivered straight to
              your inbox.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                New project announcements
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Tech tips and tutorials
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Industry insights
              </li>
            </ul>
          </div>

          <div className="flex-1 w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/50" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
              <p className="text-xs text-primary-foreground/60">
                No spam, unsubscribe anytime. I respect your privacy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
