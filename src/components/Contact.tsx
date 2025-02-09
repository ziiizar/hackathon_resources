import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useToast } from "./ui/use-toast";
import Header from "./Header";
import Footer from "./Footer";

const Contact = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending message
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });

    setIsLoading(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />
      <main className="pt-[72px] bg-gradient-to-b from-background to-muted py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions or suggestions? We'd love to hear from you. Our
              team is always here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            <Card className="md:col-span-2 bg-card/50 backdrop-blur-sm border-muted hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help?"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Your message here..."
                      className="min-h-[150px]"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-muted hover:border-primary/50 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="rounded-lg p-3 bg-primary/10 w-fit">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Email Us</h3>
                  <p className="text-sm text-muted-foreground">
                    Drop us an email and we'll get back to you within 24 hours.
                  </p>
                  <a
                    href="mailto:contact@devresources.com"
                    className="text-sm text-primary hover:underline"
                  >
                    contact@devresources.com
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-muted hover:border-primary/50 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="rounded-lg p-3 bg-primary/10 w-fit">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Need immediate help? Chat with our support team.
                  </p>
                  <Button variant="outline" className="w-full">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
