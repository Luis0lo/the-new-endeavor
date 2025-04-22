
import React from "react";
import { Archive, Leaf, Wrench } from "lucide-react";

export const getShelfIcon = (type?: "seeds" | "plants" | "tools") => {
  switch (type) {
    case "seeds":
      return <Archive className="h-6 w-6 text-yellow-500" />;
    case "plants":
      return <Leaf className="h-6 w-6 text-green-500" />;
    case "tools":
      return <Wrench className="h-6 w-6 text-blue-500" />;
    default:
      return <Archive className="h-6 w-6" />;
  }
};
