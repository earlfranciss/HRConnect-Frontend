"use client";

import { useEffect, useState } from "react";
import { FileCheck } from "lucide-react";
import { api } from "@/services/api";

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
    <div className={`p-[25px] bg-white border border-gray-200 rounded-lg w-full`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="size-9 rounded-lg bg-green-50 flex items-center justify-center">
          <FileCheck className="text-[#1CAA3A]" />
        </div>
        <h2 className="font-['Segoe_UI'] font-bold text-gray-900">Leave Request History</h2>
        <span className="ml-auto px-[10px] py-[2px] rounded-full bg-green-50 font-['Segoe_UI'] font-bold text-[11.6px] text-gray-700">
          {approvedRequests.length}
        </span>
      </div>

      {/* Leave History Cards */}
      <div className="max-h-[250px] overflow-y-auto">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : approvedRequests.length === 0 ? (
          <p className="text-gray-500 text-sm">No approved requests yet.</p>
        ) : (
          <div className="flex gap-4 w-full">
            {/* Vacation */}
            <div className="flex-1 min-w-[250px]">
              <h3 className="font-bold text-gray-700 mb-2 text-green-600">Vacation Leave</h3>
              {(approvedRequests.filter(req => req.type === "Vacation Leave") || []).map((req, i) => (
                <div key={i} className="flex flex-col p-[13px] bg-gray-50 border border-gray-100 rounded-lg mb-3 last:mb-0">
                  <div className="font-semibold text-sm text-gray-900 mb-2 truncate">{req.reason}</div>
                  <div className="flex justify-between items-center">
                  <div className="font-medium text-[11px] text-gray-500">Used Days: {req.used_days}</div>
                  <div className="font-medium text-[10px] text-gray-400">Submitted: {new Date(req.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sick */}
            <div className="flex-1 min-w-[250px]">
              <h3 className="font-bold text-gray-700 mb-2 text-yellow-600">Sick Leave</h3>
              {(approvedRequests.filter(req => req.type === "Sick Leave") || []).map((req, i) => (
                <div key={i} className="flex flex-col p-[13px] bg-gray-50 border border-gray-100 rounded-lg mb-3 last:mb-0">
                  <div className="font-semibold text-sm text-gray-900 mb-2 truncate">{req.reason}</div>
                  <div className="flex justify-between items-center">
                  <div className="font-medium text-[11px] text-gray-500">Used Days: {req.used_days}</div>
                  <div className="font-medium text-[10px] text-gray-400">Submitted: {new Date(req.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency */}
            <div className="flex-1 min-w-[250px]">
              <h3 className="font-bold text-gray-700 mb-2 text-red-600">Emergency Leave</h3>
              {(approvedRequests.filter(req => req.type === "Emergency Leave") || []).map((req, i) => (
                <div key={i} className="flex flex-col p-[13px] bg-gray-50 border border-gray-100 rounded-lg mb-3 last:mb-0">
                  <div className="font-semibold text-sm text-gray-900 mb-2 truncate">{req.reason}</div>
                  <div className="flex justify-between items-center">
                  <div className="font-medium text-[11px] text-gray-500">Used Days: {req.used_days}</div>
                  <div className="font-medium text-[10px] text-gray-400">Submitted: {new Date(req.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
