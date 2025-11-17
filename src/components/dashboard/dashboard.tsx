"use client";

import { Separator } from "@/components/ui/separator";
import UserHeader from "./UserHeader";
import LeaveBalanceCard from "./LeaveBalanceCard";
import ApprovedRequestCard from "./ApprovedRequestCard";
import PendingRequestCard from "./PendingRequestCard";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 h-screen overflow-y-auto">
      <UserHeader />

      <div className="flex flex-col gap-4 w-full">
        {/* Top section */}
        <LeaveBalanceCard />

        {/* Bottom section */}
        <div className="flex gap-4">
          <ApprovedRequestCard className="w-full" />
          <PendingRequestCard className="w-full" />
        </div>
      </div>
    </div>

  );
}
