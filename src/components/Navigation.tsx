import { Button } from "./ui/button";
import { Home, Book, Info, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
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
          <Link key={item.path} to={item.path}>
            <Button
              variant={location.pathname === item.path ? "default" : "ghost"}
              size="sm"
              className="gap-2 font-medium transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
