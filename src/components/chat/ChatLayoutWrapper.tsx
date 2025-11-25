"use client";

import ChatLayout from "@/components/chat/chat-layout";
import { useMobileMenuContext } from "./MobileMenuProvider";
import { useEffect } from "react";

interface ChatLayoutWrapperProps {
  onExpand: () => void;
  setConversationId: (id: number | null) => void;
  refreshTrigger?: number;
  onNewChat?: () => void;
}

export default function ChatLayoutWrapper(props: ChatLayoutWrapperProps) {
  const { isOpen, close } = useMobileMenuContext();

  // Inject critical styles to ensure visibility
  useEffect(() => {
    // Create and inject style tag
    const styleId = 'sidebar-critical-styles';
    let styleTag = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      styleTag.innerHTML = `
        /* Critical Sidebar Styles */
        aside {
          display: flex !important;
          background: linear-gradient(to bottom, #44B997, #4AADB9) !important;
        }
        
        aside.hidden {
          display: flex !important;
        }
        
        .flex.w-full.bg-white {
          background: transparent !important;
        }
        
        aside * {
          color: white !important;
        }
        
        /* New Chat button text should be black */
        aside button.bg-gray-100,
        aside button.bg-gray-100 * {
          color: black !important;
        }
        
        aside button {
          opacity: 1 !important;
          visibility: visible !important;
        }
        
        aside h2,
        aside span,
        aside p {
          opacity: 1 !important;
          visibility: visible !important;
        }
      `;
      document.head.appendChild(styleTag);
    }

    return () => {
      // Keep styles even on unmount for better stability
      // styleTag?.remove();
    };
  }, []);

  // Fix sidebar styling and visibility
  useEffect(() => {
    const applyStyles = () => {
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        // Remove hidden class
        sidebar.classList.remove('hidden');
        sidebar.classList.add('flex');
        
        // Apply gradient
        sidebar.style.background = 'linear-gradient(to bottom, #44B997, #4AADB9)';
        sidebar.style.display = 'flex';
        
        // Fix parent containers
        const parentDiv = sidebar.closest('.flex.w-full.bg-white');
        if (parentDiv) {
          (parentDiv as HTMLElement).style.background = 'transparent';
        }
        
        const outerDiv = sidebar.parentElement;
        if (outerDiv && outerDiv.classList.contains('bg-white')) {
          outerDiv.style.background = 'transparent';
        }
      }
    };

    applyStyles();
    
    // Apply again after delays to catch late renders
    const timer1 = setTimeout(applyStyles, 100);
    const timer2 = setTimeout(applyStyles, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Close menu when conversation is selected on mobile
  useEffect(() => {
    const handleConversationClick = (e: Event) => {
      if (window.innerWidth < 768) {
        const target = e.target as HTMLElement;
        if (target.closest('button')) {
          setTimeout(close, 300);
        }
      }
    };

    const sidebar = document.querySelector('aside');
    if (sidebar) {
      sidebar.addEventListener('click', handleConversationClick);
      return () => sidebar.removeEventListener('click', handleConversationClick);
    }
  }, [close]);

  return (
    <div 
      className={`
        fixed md:relative
        inset-y-0 left-0
        z-[100]
        pt-12 sm:pt-10 md:pt-0
        w-64
        bg-gradient-to-b from-[#44B997] to-[#4AADB9]
        transform transition-transform duration-300 ease-in-out
        md:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      style={{ background: 'linear-gradient(to bottom, #44B997, #4AADB9)' }}
    >
      <div className="w-full h-full" style={{ background: 'transparent' }}>
        <ChatLayout {...props} />
      </div>
    </div>
  );
}