"use client";

import { useState, useEffect } from "react";
import UserHeader from "./UserHeader";
import LeaveBalanceCard from "./LeaveBalanceCard";
import RequestCard from "./RequestCard";

export default function Dashboard() {
  const [refreshLeaves, setRefreshLeaves] = useState(0);

  return (
    <div className="flex flex-col gap-4 h-screen overflow-y-auto">
      {/* User Avatar */}
      <UserHeader onLeaveApplied={() => setRefreshLeaves(prev => prev + 1)} />

      <div className="flex flex-col gap-4 w-full">
        {/* Top section - Leave Balance*/}
        <LeaveBalanceCard refreshTrigger={refreshLeaves} />

        {/* Bottom section - Leave Request History*/}
        <div className="flex gap-4">
          <RequestCard refreshTrigger={refreshLeaves} />
        </div>
      </div>
    </div>

  );
}
