import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Moon, Sun, Crown, User, Heart } from "lucide-react";
import Navigation from "./Navigation";
import { AuthModal } from "./auth/AuthModal";
import { PaymentModal } from "./PaymentModal";
import { useAuth } from "@/components/auth/AuthContext";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header = ({ onSearch = () => {} }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mock suggestions for the command palette
  const suggestions = [
    { category: "Frontend", items: ["React", "Vue", "Angular"] },
    { category: "Backend", items: ["Node.js", "Python", "Java"] },
    { category: "DevOps", items: ["Docker", "Kubernetes", "AWS"] },
    { category: "Tools", items: ["VS Code", "Git", "Postman"] },
  ];

  const handleProAccess = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowPaymentModal(true);
    }
  };

  return (
    <header
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-100 ease-in-out w-full
        ${isScrolled ? "mt-4" : ""}`}
    >
      <div
        className={`mx-auto flex items-center justify-between transition-all duration-300 ease-in-out
          ${
            isScrolled
              ? "w-[95%] max-w-[1000px] h-12 px-6 bg-background/80 backdrop-blur-md border rounded-full shadow-lg text-foreground dark:text-white"
              : "w-full h-16 px-6 bg-transparent text-white"
          }
        `}
      >
        <div className="flex items-center gap-6">
          <h1
            className="text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() =>
              (window.location.href = import.meta.env.BASE_URL || "/")
            }
          >
            DevHub
          </h1>
          <Navigation />
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() =>
              window.open("https://paypal.me/ErnestoFerrando", "_blank")
            }
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-6 gap-2 shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/40"
            size="sm"
          >
            <Heart className="h-4 w-4" />
            Support Us
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setShowAuthModal(true)}>Sign In</Button>
          )}
        </div>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
      />

      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {suggestions.map((group) => (
            <CommandGroup key={group.category} heading={group.category}>
              {group.items.map((item) => (
                <CommandItem
                  key={item}
                  onSelect={() => {
                    onSearch(item);
                    setIsSearchOpen(false);
                  }}
                >
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </header>
  );
};

export default Header;
