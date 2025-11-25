"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Menu } from "lucide-react";

interface MobileMenuContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export function useMobileMenuContext() {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error("useMobileMenuContext must be used within MobileMenuProvider");
  }
  return context;
}

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  // Close on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        close();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <MobileMenuContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

// Mobile Menu Button Component
export function MobileMenuButton() {
  const { toggle } = useMobileMenuContext();

  return (
    <button
      onClick={toggle}
      className="fixed top-4 left-4 z-[101] md:hidden bg-white rounded-lg p-2 shadow-lg hover:bg-gray-50 transition-colors"
      aria-label="Toggle Menu"
    >
      <Menu className="w-4 h-4 text-gray-700" />
    </button>
  );
}

// Overlay Component
export function MobileMenuOverlay() {
  const { isOpen, close } = useMobileMenuContext();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[99] md:hidden animate-in fade-in duration-200"
      onClick={close}
    />
  );
}