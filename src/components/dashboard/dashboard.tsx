"use client";

import { useState, useEffect } from "react";
import UserHeader from "./UserHeader";
import LeaveBalanceCard from "./LeaveBalanceCard";
import RequestCard from "./RequestCard";
import AttendanceCard from "./AttendanceCard";
import ApprovedRequests from "./ApprovedRequests";
import PendingRequest from "./PendingRequest";

export default function Dashboard() {
  const [refreshLeaves, setRefreshLeaves] = useState(0);

  return (
    <div className="flex flex-col gap-4 min-h-screen w-full max-w-4xl mx-auto pb-20 md:pb-4">
      {/* User Avatar */}
      <UserHeader onLeaveApplied={() => setRefreshLeaves(prev => prev + 1)} />

      <div className="flex flex-col gap-4 w-full">
        {/* Top section - Leave Balance & Attendance */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:flex-1">
            <LeaveBalanceCard refreshTrigger={refreshLeaves} />
          </div>
          <div className="w-full lg:w-auto">
            <AttendanceCard />
          </div>
        </div>

        {/* Middle section - Leave Request History */}
        <div className="flex gap-4 w-full">
          <RequestCard refreshTrigger={refreshLeaves} />
        </div>

        {/* Bottom section - Approved & Pending Requests */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <ApprovedRequests />
          <PendingRequest />
        </div>
      </div>
    </div>
  );
}