"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleProps {
    title: string;
    children: React.ReactNode;
}

export default function Collapsible({ title, children }: CollapsibleProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg shadow-sm -mt-1 text-[#1B2559]">
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex justify-between items-center px-4 py-3 bg-[#F0F6FF] text-[#1B2559] font-medium hover:bg-[#D3E1F6] transition 
                    ${isOpen ? "rounded-t-md" : "rounded-md"}`}
            >
                <span>{title}</span>
                <ChevronDown
                    className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>


            {/* Content */}
            <div
                className={`overflow-hidden transition-all duration-300 bg-[#F0F6FF] ${isOpen ? "max-h-96 p-2 rounded-b-md" : "max-h-0 p-0 rounded-md"
                    }`}
            >
                {Array.isArray(children)
                    ? children.map((child, index) => (
                        <div
                            key={index}
                            className="p-3 rounded-md hover:bg-[#D3E1F6] border-t border-white transition cursor-pointer"
                        >
                            {child}
                        </div>
                    ))
                    : (
                        <div className="p-3 rounded-md border-t border-white hover:bg-[#D3E1F6] transition cursor-pointer">
                            {children}
                        </div>
                    )}
            </div>

        </div>
    );
}
