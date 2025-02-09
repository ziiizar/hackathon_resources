import { Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dev Resources</h3>
            <p className="text-sm text-muted-foreground">
              Your gateway to development excellence. Curated resources for
              developers at every level.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="/resources"
                  className="hover:text-foreground transition-colors"
                >
                  Browse All
                </a>
              </li>
              <li>
                <a
                  href="/resources?type=frontend"
                  className="hover:text-foreground transition-colors"
                >
                  Frontend
                </a>
              </li>
              <li>
                <a
                  href="/resources?type=backend"
                  className="hover:text-foreground transition-colors"
                >
                  Backend
                </a>
              </li>
              <li>
                <a
                  href="/resources?type=devops"
                  className="hover:text-foreground transition-colors"
                >
                  DevOps
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Connect</h4>
            <div className="flex space-x-2">
              <a
                href="https://github.com/ziiizar/hackathon_resources"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon">
                  <Github className="h-4 w-4" />
                </Button>
              </a>
              <a
                href="https://x.com/Cesar47528113"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon">
                  <Twitter className="h-4 w-4" />
                </Button>
              </a>
              <a
                href="https://www.linkedin.com/in/cesar-ferrando/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {year} Dev Resources. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
