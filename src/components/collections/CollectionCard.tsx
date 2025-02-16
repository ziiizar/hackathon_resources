import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { MoreHorizontal, Lock, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface CollectionCardProps {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  resourceCount: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

import { useNavigate } from "react-router-dom";

export function CollectionCard({
  id,
  name,
  description,
  isPublic,
  resourceCount,
  onEdit,
  onDelete,
}: CollectionCardProps) {
  const navigate = useNavigate();
  return (
    <Card
      className="group hover:border-primary/50 transition-colors cursor-pointer"
      onClick={() => navigate(`/collection/${id}`)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold leading-none tracking-tight">{name}</h3>
          {isPublic ? (
            <Globe className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Lock className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-600 focus:text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {resourceCount} {resourceCount === 1 ? "resource" : "resources"}
        </p>
      </CardContent>
    </Card>
  );
}
