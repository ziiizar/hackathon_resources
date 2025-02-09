import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Code, Database, Server, Wrench } from "lucide-react";

import type { ResourceType } from "@/lib/data";

interface ResourceCardProps {
  title?: string;
  description?: string;
  type?: ResourceType;
  subcategory?: string;
  isPaid?: boolean;
  url?: string;
}

const getIconByType = (type: ResourceType) => {
  switch (type) {
    case "Frontend":
      return Code;
    case "Design":
      return Wrench;
    case "AI Agents":
      return Server;
    case "AI Chats":
      return Database;
    default:
      return Code;
  }
};

export const ResourceCard = ({
  title = "Sample Resource",
  description = "This is a sample resource description that provides an overview of what this resource category contains.",
  type = "Frontend",
  subcategory = "General",
  isPaid = false,
  url = "#",
}: ResourceCardProps) => {
  const Icon = getIconByType(type);

  const handleClick = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <TooltipProvider>
      <Card
        className="w-full h-[140px] bg-[#0F172A] hover:bg-[#1E293B] transition-all duration-300 cursor-pointer border border-gray-800/50 hover:border-violet-500/30"
        onClick={handleClick}
      >
        <CardHeader className="pb-1 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-base font-medium text-white">{title}</h3>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={isPaid ? "destructive" : "default"}>
                  {isPaid ? "Paid" : "Free"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isPaid ? "Requires payment" : "Free resource"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="pb-1 pt-0">
          <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Badge variant="outline">{subcategory}</Badge>
          <Badge variant="secondary">{type}</Badge>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};
