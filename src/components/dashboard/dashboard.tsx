"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import UserHeader from "./UserHeader";
import LeaveBalanceCard from "./LeaveBalanceCard";
import RequestCard from "./RequestCard";
import PendingRequestCard from "./PendingRequestCard";

export default function Dashboard() {
  const [refreshLeaves, setRefreshLeaves] = useState(0);

  return (
    <div className="flex flex-col gap-4 h-screen overflow-y-auto">
      <UserHeader onLeaveApplied={() => setRefreshLeaves(prev => prev + 1)} />

      <div className="flex flex-col gap-4 w-full">
        {/* Top section */}
        <LeaveBalanceCard refreshTrigger={refreshLeaves} />

        {/* Bottom section */}
        <div className="flex gap-4">
          <RequestCard refreshTrigger={refreshLeaves} />
        </div>
      </div>
    </div>

  );
}
