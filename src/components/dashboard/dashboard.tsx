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
    <div className="flex flex-col gap-4 h-screen">
      {/* User Avatar */}
      <UserHeader onLeaveApplied={() => setRefreshLeaves(prev => prev + 1)} />

      <div className="flex flex-col gap-4 w-full">
        {/* Top section - Leave Balance*/}
        <div className="flex gap-4">
          <LeaveBalanceCard refreshTrigger={refreshLeaves} />
          <AttendanceCard />
        </div>

        {/* Bottom section - Leave Request History*/}
        <div className="flex gap-4">
          <RequestCard refreshTrigger={refreshLeaves} />
        </div>


      <div className="flex gap-4 w-full">
        <ApprovedRequests />
        <PendingRequest />
      </div>
      </div>
    </div>

  );
}
