import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const Contact = () => {
  return (
    <div className="max-w-md mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="text-muted-foreground mb-6">
        Have questions or suggestions? We'd love to hear from you.
      </p>
      <form className="space-y-4">
        <div>
          <Input placeholder="Your name" />
        </div>
        <div>
          <Input type="email" placeholder="Your email" />
        </div>
        <div>
          <Textarea placeholder="Your message" className="min-h-[150px]" />
        </div>
        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    </div>
  );
};

export default Contact;
