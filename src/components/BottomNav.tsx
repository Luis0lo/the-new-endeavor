
import { Home, BookOpen, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function BottomNav() {
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background md:hidden">
      <div className="mx-auto flex h-full max-w-md items-center justify-around">
        <Link
          to="/dashboard"
          className={cn(
            "flex flex-col items-center justify-center space-y-1",
            location.pathname === "/dashboard"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <Home size={20} />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to="/blog"
          className={cn(
            "flex flex-col items-center justify-center space-y-1",
            location.pathname === "/blog"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <BookOpen size={20} />
          <span className="text-xs">Blog</span>
        </Link>
        <Link
          to="/auth"
          className={cn(
            "flex flex-col items-center justify-center space-y-1",
            location.pathname === "/auth"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <LogIn size={20} />
          <span className="text-xs">Login</span>
        </Link>
      </div>
    </nav>
  );
}
