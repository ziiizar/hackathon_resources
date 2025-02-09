import { Button } from "./ui/button";
import { Home, Book, Info, Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Resources", icon: Book, path: "/resources" },
    { label: "Contact", icon: Mail, path: "/contact" },
  ];

  return (
    <nav className="flex items-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.path}
            variant={location.pathname === item.path ? "default" : "ghost"}
            onClick={() => navigate(item.path)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
};

export default Navigation;
