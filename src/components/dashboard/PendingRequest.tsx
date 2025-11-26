"use client";

import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PendingRequest() {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate data fetching
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col w-full bg-white rounded-lg border border-gray-200 p-4 sm:p-[25px] mb-6">
            <div className="flex items-center gap-2 mb-4">
                {isLoading ? (
                    // Skeleton Loading State
                    <>
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-5 w-25 rounded-md" />
                    </>
                ) : (
                    <>
                        <div className="size-8 sm:size-9 rounded-lg bg-yellow-50 flex items-center justify-center">
                            <FileText className="text-[#E7C128] w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <h2 className="font-['Segoe_UI'] font-bold text-sm sm:text-base text-gray-900">Pending Requests</h2>
                    </>
                )}
                {isLoading ? (
                    <Skeleton className="ml-auto h-5 w-6 rounded-full" />
                ) : (
                    <span className="ml-auto px-2 sm:px-[10px] py-[2px] rounded-full bg-yellow-50 font-['Segoe_UI'] font-bold text-[10px] sm:text-[11.6px] text-gray-700">3</span>
                )}
            </div>

            <div className="max-h-[250px] overflow-y-auto">
                {isLoading ? (
                    // Skeleton Loading State
                    <>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="relative p-3 sm:p-[13px] bg-gray-50 border border-gray-100 rounded-lg mb-3 last:mb-0">
                                <Skeleton className="absolute top-3 sm:top-[13px] right-3 sm:right-[13px] h-6 w-20 rounded-full" />
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-3 w-28 mb-1" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        ))}
                    </>
                ) : (
                    // Actual Data
                    [
                        { title: 'Leave Request', submitted: 'Nov 20', approver: 'John Smith' },
                        { title: 'Reimbursement', submitted: 'Nov 18', approver: 'Finance Team' },
                        { title: 'WFH Request', submitted: 'Nov 22', approver: 'Manager' }
                    ].map((req, i) => (
                        <div key={i} className="relative p-3 sm:p-[13px] bg-gray-50 border border-gray-100 rounded-lg mb-3 last:mb-0">
                            <span className="absolute top-3 sm:top-[13px] right-3 sm:right-[13px] px-2 sm:px-[11px] py-[2px] sm:py-[3px] bg-yellow-50 border border-yellow-300 rounded-full font-['Segoe_UI'] font-bold text-[10px] sm:text-xs text-gray-700">Pending</span>
                            <div className="font-['Segoe_UI'] font-semibold text-xs sm:text-sm text-gray-900 mb-2 pr-20 sm:pr-24">{req.title}</div>
                            <div className="font-['Segoe_UI'] font-semibold text-[10px] sm:text-[11.6px] text-gray-500 mb-1">Submitted: {req.submitted}</div>
                            <div className="font-['Segoe_UI'] font-semibold text-[10px] sm:text-[11.6px] text-gray-500">Approver: {req.approver}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}