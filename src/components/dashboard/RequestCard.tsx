"use client";

import { useEffect, useState } from "react";
import { FileCheck } from "lucide-react";
import { api } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

interface LeaveHistoryItem {
  used_days: number;
  reason: string;
  created_at: string;
  type: "Vacation Leave" | "Sick Leave" | "Emergency Leave";
}

export default function RequestCard({ refreshTrigger }: { refreshTrigger: number }) {
  const [approvedRequests, setApprovedRequests] = useState<LeaveHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all leave histories
  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const [emergency, vacation, sick] = await Promise.all([
          api.getEmergencyHistory(),
          api.getVacationHistory(),
          api.getSickHistory(),
          new Promise(resolve => setTimeout(resolve, 800))
        ]);

        // Combine all histories
        const combinedHistory: LeaveHistoryItem[] = [
          ...(emergency.history || []).map((item: LeaveHistoryItem) => ({ ...item, type: "Emergency Leave" })),
          ...(vacation.history || []).map((item: LeaveHistoryItem) => ({ ...item, type: "Vacation Leave" })),
          ...(sick.history || []).map((item: LeaveHistoryItem) => ({ ...item, type: "Sick Leave" })),
        ];

        setApprovedRequests(combinedHistory);
      } catch (err) {
        console.error("Failed to fetch leave history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [refreshTrigger]);

  return (
    <div className="p-4 sm:p-[25px] bg-white border border-gray-200 rounded-lg w-full">
      <div className="flex items-center gap-2 mb-4">
        {loading ? (
          // Skeleton Loading State
          <>
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-5 w-40 rounded-md" />
          </>
        ) : (
          <>
            <div className="size-8 sm:size-9 rounded-lg bg-green-50 flex items-center justify-center">
              <FileCheck className="text-[#1CAA3A] w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="font-['Segoe_UI'] font-bold text-sm sm:text-base text-gray-900">Leave Request History</h2>
          </>
        )}

        {loading ? (
          <Skeleton className="ml-auto h-5 w-6 rounded-full" />
        ) : (
          <span className="ml-auto px-2 sm:px-[10px] py-[2px] rounded-full bg-green-50 font-['Segoe_UI'] font-bold text-[10px] sm:text-[11.6px] text-gray-700">
            {approvedRequests.length}
          </span>
        )}
      </div>

      {/* Leave History Cards */}
      <div className="max-h-[250px] overflow-y-auto">
        {loading ? (
          // Skeleton Loading State
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full">
            {/* Vacation Skeleton */}
            <div className="flex-1 min-w-full md:min-w-[250px]">
              <Skeleton className="h-5 w-32 mb-2" />
              <div className="space-y-2 sm:space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex flex-col p-3 sm:p-[13px] bg-gray-50 border border-gray-100 rounded-lg">
                    <Skeleton className="h-4 w-full mb-2" />
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sick Skeleton */}
            <div className="flex-1 min-w-full md:min-w-[250px]">
              <Skeleton className="h-5 w-24 mb-2" />
              <div className="space-y-2 sm:space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex flex-col p-3 sm:p-[13px] bg-gray-50 border border-gray-100 rounded-lg">
                    <Skeleton className="h-4 w-full mb-2" />
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Skeleton */}
            <div className="flex-1 min-w-full md:min-w-[250px]">
              <Skeleton className="h-5 w-32 mb-2" />
              <div className="space-y-2 sm:space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex flex-col p-3 sm:p-[13px] bg-gray-50 border border-gray-100 rounded-lg">
                    <Skeleton className="h-4 w-full mb-2" />
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : approvedRequests.length === 0 ? (
          <p className="text-gray-500 text-sm">No approved requests yet.</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full overflow-x-auto">
            {/* Vacation */}
            <div className="flex-1 min-w-full md:min-w-[250px]">
              <h3 className="font-bold text-sm text-green-600 mb-2">Vacation Leave</h3>
              <div className="space-y-2 sm:space-y-3">
                {approvedRequests.filter(req => req.type === "Vacation Leave").length === 0 ? (
                  <p className="text-gray-400 text-xs">No vacation leave history</p>
                ) : (
                  approvedRequests.filter(req => req.type === "Vacation Leave").map((req, i) => (
                    <div key={i} className="flex flex-col p-3 sm:p-[13px] bg-gray-50 border border-gray-100 rounded-lg">
                      <div className="font-semibold text-xs sm:text-sm text-gray-900 mb-2 truncate">{req.reason}</div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                        <div className="font-medium text-[10px] sm:text-[11px] text-gray-500">Used Days: {req.used_days}</div>
                        <div className="font-medium text-[9px] sm:text-[10px] text-gray-400">
                          Submitted: {new Date(req.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sick */}
            <div className="flex-1 min-w-full md:min-w-[250px]">
              <h3 className="font-bold text-sm text-yellow-600 mb-2">Sick Leave</h3>
              <div className="space-y-2 sm:space-y-3">
                {approvedRequests.filter(req => req.type === "Sick Leave").length === 0 ? (
                  <p className="text-gray-400 text-xs">No sick leave history</p>
                ) : (
                  approvedRequests.filter(req => req.type === "Sick Leave").map((req, i) => (
                    <div key={i} className="flex flex-col p-3 sm:p-[13px] bg-gray-50 border border-gray-100 rounded-lg">
                      <div className="font-semibold text-xs sm:text-sm text-gray-900 mb-2 truncate">{req.reason}</div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                        <div className="font-medium text-[10px] sm:text-[11px] text-gray-500">Used Days: {req.used_days}</div>
                        <div className="font-medium text-[9px] sm:text-[10px] text-gray-400">
                          Submitted: {new Date(req.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Emergency */}
            <div className="flex-1 min-w-full md:min-w-[250px]">
              <h3 className="font-bold text-sm text-red-600 mb-2">Emergency Leave</h3>
              <div className="space-y-2 sm:space-y-3">
                {approvedRequests.filter(req => req.type === "Emergency Leave").length === 0 ? (
                  <p className="text-gray-400 text-xs">No emergency leave history</p>
                ) : (
                  approvedRequests.filter(req => req.type === "Emergency Leave").map((req, i) => (
                    <div key={i} className="flex flex-col p-3 sm:p-[13px] bg-gray-50 border border-gray-100 rounded-lg">
                      <div className="font-semibold text-xs sm:text-sm text-gray-900 mb-2 truncate">{req.reason}</div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                        <div className="font-medium text-[10px] sm:text-[11px] text-gray-500">Used Days: {req.used_days}</div>
                        <div className="font-medium text-[9px] sm:text-[10px] text-gray-400">
                          Submitted: {new Date(req.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}