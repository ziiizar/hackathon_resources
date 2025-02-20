import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuth } from "@/components/auth/AuthContext";
import { useToast } from "../ui/use-toast";

interface AuthModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AuthModal({ open = true, onOpenChange }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    mode: "signin" | "signup",
  ) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validación básica
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      if (mode === "signin") {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in",
        });
      } else {
        await signUp(email, password);
        toast({
          title: "Account created!",
          description:
            "Please check your email to confirm your account. You may need to check your spam folder.",
          duration: 6000,
        });
      }
      onOpenChange?.(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      let userFriendlyMessage = errorMessage;

      // Mensajes de error más amigables
      if (errorMessage.includes("Invalid login credentials")) {
        userFriendlyMessage = "Invalid email or password. Please try again.";
      } else if (errorMessage.includes("Email not confirmed")) {
        userFriendlyMessage =
          "Please confirm your email address before signing in. Check your inbox for the confirmation link.";
      } else if (errorMessage.includes("User already registered")) {
        userFriendlyMessage =
          "An account with this email already exists. Try signing in instead.";
      } else if (errorMessage.includes("rate limit")) {
        userFriendlyMessage =
          "Too many attempts. Please try again in a few minutes.";
      }

      toast({
        title: "Error",
        description: userFriendlyMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to DevCourier</DialogTitle>
          <DialogDescription>
            Join our community to save and organize your favorite development
            resources
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form
              onSubmit={(e) => handleSubmit(e, "signin")}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input id="signin-email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <div className="space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Don't have an account? Click the Sign Up tab above
                </p>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form
              onSubmit={(e) => handleSubmit(e, "signup")}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <div className="space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Already have an account? Click the Sign In tab above
                </p>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
