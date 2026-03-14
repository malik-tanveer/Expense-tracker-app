import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white px-6">
      
      <div className="text-center max-w-lg">
        
        <div className="flex justify-center mb-6 text-red-500">
          <AlertTriangle size={70} />
        </div>

        <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
          404
        </h1>

        <p className="text-gray-400 mb-6 text-lg">
          Oops! The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
        >
          <Home size={18} />
          Go Back Home
        </Link>
      </div>
    </div>
  );
}