"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function AttendanceCard() {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate data fetching
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-[20px]">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
                {isLoading ? (
                    // Skeleton Loading State
                    <>
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-5 w-25 rounded-md" />
                    </>
                ) : (
                    <>
                        <div className="size-8 sm:size-9 rounded-lg bg-green-50 flex items-center justify-center">
                            <Calendar className="text-[#1CAA3A] w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <h2 className="font-['Segoe_UI'] font-bold text-sm sm:text-base text-gray-900">Attendance</h2>
                    </>
                )}

            </div>

            {isLoading ? (
                // Skeleton Loading State
                <>
                    {/* Calendar Days Skeleton */}
                    <div className="overflow-x-auto mb-1 sm:mb-2">
                        <div className="flex justify-center min-w-max px-2 sm:px-0">
                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                <div key={i} className="flex flex-col p-2 sm:p-1 rounded-lg justify-center items-center">
                                    <Skeleton className="h-4 w-8 rounded-md mb-2" />
                                    <Skeleton className="w-6 h-6 sm:w-7 sm:h-7 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Legend Skeleton */}
                    <div className="flex flex-wrap justify-center gap-1 sm:gap-0">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex p-2 sm:p-2 rounded-lg justify-center items-center gap-1">
                                <Skeleton className="w-3 h-3 rounded-full" />
                                <Skeleton className="h-3 w-12 rounded-md" />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                // Actual Attendance Data
                <>
                    {/* Scrollable container for mobile */}
                    <div className="overflow-x-auto mb-1 sm:mb-2">
                        <div className="flex justify-center min-w-max px-2 sm:px-0">
                            {[
                                { day: 'Mon', date: 9, color: "#11C839" },
                                { day: 'Tue', date: 10, color: "#11C839" },
                                { day: 'Wed', date: 11, color: "#FA2323" },
                                { day: 'Thu', date: 12, color: "#11C839" },
                                { day: 'Fri', date: 13, color: "#11C839" },
                                { day: 'Sat', date: 14, color: "blue" },
                                { day: 'Sun', date: 15, color: "gray" },
                            ].map((req, i) => (
                                <div key={i} className="flex flex-col p-2 sm:p-1 rounded-lg justify-center items-center">
                                    <div className="font-light text-xs text-gray-900 mb-2">{req.day}</div>
                                    <span
                                        className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full font-bold text-xs text-white"
                                        style={{ backgroundColor: req.color }}
                                    >
                                        {req.date}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    <div className="flex flex-wrap justify-center gap-1 sm:gap-0">
                        {[
                            { legend: 'Present', color: "#11C839" },
                            { legend: 'Absent', color: "#FA2323" },
                            { legend: 'Today', color: "blue" },
                        ].map((req, i) => (
                            <div key={i} className="flex p-2 sm:p-2 rounded-lg justify-center items-center gap-1">
                                <span
                                    className="flex items-center justify-center w-3 h-3 rounded-full"
                                    style={{ backgroundColor: req.color }}
                                ></span>
                                <div className="font-light text-xs text-gray-900">{req.legend}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}