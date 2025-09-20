import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Button from "../ui/Button";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo → Home using window */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => {
              setMenuOpen(false); // close menu if open
              window.location.href = "/"; // go home
            }}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6S4MCoi-TuAFNAd1V-U-uscxa9w2HIchmPA&s"
              alt="Dhani Finance Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* CTA + Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => (window.location.href = "/apply")}
              className="hidden sm:block"
            >
              <Button size="sm">Apply Now</Button>
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <nav className="flex flex-col p-4 space-y-4">
            <button
              onClick={() => {
                setMenuOpen(false);
                window.location.href = "/apply";
              }}
            >
              <Button size="sm" className="w-full">
                Apply Now
              </Button>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
