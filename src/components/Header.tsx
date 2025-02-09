import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Moon, Sun, Crown, User } from "lucide-react";
import Navigation from "./Navigation";
import { AuthModal } from "./auth/AuthModal";
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
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  onSearch?: (query: string) => void;
}

const Header = ({
  onThemeToggle = () => {},
  isDarkMode = false,
  onSearch = () => {},
}: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  // Mock suggestions for the command palette
  const suggestions = [
    { category: "Frontend", items: ["React", "Vue", "Angular"] },
    { category: "Backend", items: ["Node.js", "Python", "Java"] },
    { category: "DevOps", items: ["Docker", "Kubernetes", "AWS"] },
    { category: "Tools", items: ["VS Code", "Git", "Postman"] },
  ];

  return (
    <header className="w-full h-[72px] px-6 bg-background border-b flex items-center justify-between fixed top-0 z-50">
      <div className="flex items-center gap-6">
        <h1
          className="text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => (window.location.href = "/")}
        >
          Dev Resources
        </h1>
        <Navigation />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {user ? (
          <>
            <Button
              onClick={() =>
                window.open(
                  "https://www.paypal.com/paypalme/yourpaypallink/5",
                  "_blank",
                )
              }
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 gap-2"
            >
              <Crown className="h-4 w-4" />
              Pro Lifetime ($5)
            </Button>
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
          </>
        ) : (
          <Button onClick={() => setShowAuthModal(true)}>Sign In</Button>
        )}
        <Button variant="ghost" size="icon" onClick={onThemeToggle}>
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />

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
