"use client";

import { useEffect, useState } from "react";
import { File, } from "lucide-react";
import { api } from "@/services/api";

interface LeaveRequest {
    total_days: number;
    used_days: number;
    type: "Vacation Leave" | "Sick Leave" | "Emergency Leave" ;
}


export default function LeaveBalanceCard({ refreshTrigger }: { refreshTrigger: number }) {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

    useEffect(() => {
        async function fetchLeaves() {
            try {
                const [vacation, sick, emergency] = await Promise.all([
                    api.getVacationLeave(),
                    api.getSickLeave(),
                    api.getEmergencyLeave(),
                ]);

                const leaves = [
                    { ...vacation, type: "Vacation Leave" },
                    { ...sick, type: "Sick Leave" },
                    { ...emergency, type: "Emergency Leave" },
                ];

                setLeaveRequests(leaves);
            } catch (err) {
                console.error("Failed to fetch leave requests:", err);
            }
        }

        fetchLeaves();
    }, [refreshTrigger]);


    return (
        <div className="bg-white rounded-lg border border-gray-200  p-[25px]">
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                    <div className="size-9 rounded-lg bg-blue-50 flex items-center justify-center">
                        <File className="text-[#9BB7FF]" />
                    </div>
                    <h2 className="font-['Segoe_UI'] font-bold text-gray-900">Leave Balance</h2>

                </div>

            </div>
            <div className="flex gap-4 w-full">
                {leaveRequests.map((leave, i) => {
                    // Calculate remaining percentage for this leave
                    const remainingPercent = ((leave.total_days - leave.used_days) / leave.total_days) * 100;

                    // Determine color based on remaining percent
                    const barColor =
                        remainingPercent < 20
                            ? "bg-red-500"
                            : remainingPercent < 60
                                ? "bg-orange-500"
                                : "bg-blue-500";

                    return (
                        <div key={i} className="flex-1 p-[13px] bg-gray-50 border border-gray-100 rounded-lg mb-3">
                            <div className="flex justify-between gap-8 items-center mb-2">
                                <span className="font-['Segoe_UI'] font-semibold text-sm text-gray-600">{leave.type}</span>
                                <div>
                                    <span className="font-['Segoe_UI'] font-bold text-[17.4px] text-gray-900">{leave.total_days - leave.used_days}</span>
                                    <span className="font-['Segoe_UI'] font-semibold text-sm text-gray-500">/{leave.total_days}</span>
                                </div>
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${barColor}`}
                                    style={{ width: `${remainingPercent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}