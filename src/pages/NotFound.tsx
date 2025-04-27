
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "@/components/MainLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Oops! The page <span className="font-mono bg-muted px-2 py-1 rounded">{location.pathname}</span> cannot be found
          </p>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">You might want to check out:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
              >
                Home
              </Link>
              <Link 
                to="/greenlink" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md"
              >
                Greenlink
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
