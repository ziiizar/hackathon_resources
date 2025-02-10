import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./auth/AuthContext";
import { supabase } from "@/lib/supabase";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentModal({ open, onOpenChange }: PaymentModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePaypalRedirect = () => {
    window.open("https://www.paypal.com/paypalme/yourpaypallink/5", "_blank");
  };

  const handleConfirmPayment = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase.from("payments").insert({
        user_id: user.id,
        amount: 5,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Thank you for your payment!",
        description: "Your PRO access will be activated within 12 hours.",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error registering payment:", error);
      toast({
        title: "Error",
        description: "There was a problem processing your confirmation.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade to PRO</DialogTitle>
          <DialogDescription>
            You're about to upgrade your account to PRO. Here's how it works:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm text-muted-foreground">
          <p>1. You'll be redirected to PayPal to make a $5 USD payment</p>
          <p>2. After payment, click "Confirm Payment"</p>
          <p>3. You'll receive PRO access within 12 hours</p>
          <p className="font-medium text-foreground">
            Price: $5 USD (one-time payment)
          </p>
        </div>
        <DialogFooter className="flex-col space-y-2 sm:space-y-0">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="sm:flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handlePaypalRedirect}
              className="sm:flex-1 bg-[#0070BA] hover:bg-[#005ea6]"
            >
              Go to PayPal
            </Button>
            <Button
              onClick={handleConfirmPayment}
              className="sm:flex-1 bg-violet-600 hover:bg-violet-700"
            >
              Confirm Payment
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
