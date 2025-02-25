import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { CheckCircle2 } from "lucide-react";

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Email Confirmed!</h1>
        <p className="text-muted-foreground">
          Your email has been successfully confirmed. You can now sign in to
          your account.
        </p>
        <div className="pt-4">
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Go to Sign In ({countdown})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
