"use client";

import UserHeader from "./UserHeader";
import LeaveBalanceCard from "./LeaveBalanceCard";
import ApprovedRequestCard from "./ApprovedRequestCard";
import AttendanceCard from "./AttendanceCard";
import PendingRequestCard from "./PendingRequestCard";

export default function Dashboard() {
    return (
        <div>
            <UserHeader />

            <div className="flex gap-4">
                {/* Left section */}
                <div className="flex flex-col gap-4">
                    <LeaveBalanceCard />

                    <ApprovedRequestCard />
                </div>

                {/* Right section */}
                <div className="flex flex-col gap-4">
                    <AttendanceCard />

                    <PendingRequestCard />
                </div>
            </div>
        </div>
    );
}
