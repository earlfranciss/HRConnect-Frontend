"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator"
import { Bell, Settings, Calendar, File, FileCheck, FileText, Plus } from "lucide-react";

export default function Dashboard() {
    return (
        <div>
            <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">Louell Grey Miones</p>
                        <p className="text-xs text-[#6C6767]">ERP - Software Engineer</p>
                    </div>
                </div>
                <div className="flex gap-4 ">
                    <Popover>
                        <PopoverTrigger>
                            <Bell size={18} />
                        </PopoverTrigger>
                        <PopoverContent className="">Notifications</PopoverContent>
                    </Popover>
                    <DropdownMenu>
                        <DropdownMenuTrigger><Settings size={18} /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <Separator />

            <div className="justify-start p-4">
                <p className="text-lg font-semibold">Welcome back, Louell Grey! 👋</p>
                <p className="text-xs text-[#6C6767]">Here's what's happening with your work today</p>
            </div>
            <div className="flex gap-4">
                {/* Left section */}
                <div className="flex flex-col gap-4">
                    {/* Leave Balance */}
                    <div className="bg-white rounded-lg border border-gray-200  p-[25px]">
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="size-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <File className="text-[#9BB7FF]" />

                                </div>
                                <h2 className="font-['Segoe_UI'] font-bold text-gray-900">Leave Balance</h2>

                            </div>
                            <div className="flex items-center gap-1">

                                <Plus size={14} className="text-blue-500" />
                                <h2 className="text-xs text-blue-500">Apply for leave</h2>
                            </div>
                        </div>
                        <div className="max-h-[280px] flex gap-2">
                            {[
                                { type: 'Vacation Leave', used: 12, total: 18 },
                                { type: 'Sick Leave', used: 5, total: 10 },
                                { type: 'Emergency Leave', used: 3, total: 8 },
                            ].map((leave, i) => (
                                <div key={i} className="p-[13px] bg-gray-50 border border-gray-100 rounded-lg mb-3 ">
                                    <div className="flex justify-between gap-8 items-center mb-2">
                                        <span className="font-['Segoe_UI'] font-semibold text-sm text-gray-600">{leave.type}</span>
                                        <div>
                                            <span className="font-['Segoe_UI'] font-bold text-[17.4px] text-gray-900">{leave.used}</span>
                                            <span className="font-['Segoe_UI'] font-semibold text-sm text-gray-500">/{leave.total}</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${(leave.used / leave.total) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* My Approved Requests */}
                    <div className="bg-white rounded-lg border border-gray-200  p-[25px]">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="size-9 rounded-lg bg-green-50 flex items-center justify-center">
                                <FileCheck className="text-[#1CAA3A]" />
                            </div>
                            <h2 className="font-['Segoe_UI'] font-bold text-gray-900">Approved Requests</h2>
                            <span className="ml-auto px-[10px] py-[2px] rounded-full bg-green-50 font-['Segoe_UI'] font-bold text-[11.6px] text-gray-700">3</span>
                        </div>
                        <div className="max-h-[250px] overflow-y-auto">
                            {[
                                { title: 'Leave Request', submitted: 'Nov 20', approver: 'John Smith' },
                                { title: 'Reimbursement', submitted: 'Nov 18', approver: 'Finance Team' },
                                { title: 'WFH Request', submitted: 'Nov 22', approver: 'Manager' }
                            ].map((req, i) => (
                                <div key={i} className="relative p-[13px] bg-gray-50 border border-gray-100 rounded-lg mb-3 last:mb-0">
                                    <span className="absolute top-[13px] right-[13px] px-[11px] py-[3px] bg-green-50 border border-green-300 rounded-full font-['Segoe_UI'] font-bold text-xs text-gray-700">Approved</span>
                                    <div className="font-['Segoe_UI'] font-semibold text-sm text-gray-900 mb-2 pr-20">{req.title}</div>
                                    <div className="font-['Segoe_UI'] font-semibold text-[11.6px] text-gray-500 mb-1">Submitted: {req.submitted}</div>
                                    <div className="font-['Segoe_UI'] font-semibold text-[11.6px] text-gray-500">Approver: {req.approver}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right section */}
                <div className="flex flex-col gap-4">
                    {/* Attendance */}
                    <div className="bg-white rounded-lg border border-gray-200 pb-1 p-[25px] ">
                        <div className="flex items-center gap-2 ">
                            <div className="size-9 rounded-lg bg-green-50 flex items-center justify-center">
                                <Calendar className="text-[#1CAA3A]" />
                            </div>
                            <h2 className="font-['Segoe_UI'] font-bold text-gray-900">Attendance</h2>
                        </div>
                        <div className="max-h-[250px] flex">
                            {[
                                { day: 'Mon', date: 9, color: "#11C839" },
                                { day: 'Tue', date: 10, color: "#11C839" },
                                { day: 'Wed', date: 11, color: "#FA2323" },
                                { day: 'Thu', date: 12, color: "#11C839" },
                                { day: 'Fri', date: 13, color: "#11C839" },
                                { day: 'Sat', date: 14, color: "blue" },
                                { day: 'Sun', date: 15, color: "gray" },
                            ].map((req, i) => (
                                <div key={i} className="flex flex-col p-2 rounded-lg justify-center items-center mb-1 ">
                                    <div className=" font-light text-xs text-gray-500 mb-2">{req.day}</div>
                                    <span
                                        className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs text-white"
                                        style={{ backgroundColor: req.color, }}
                                    >
                                        {req.date}
                                    </span>                                </div>
                            ))}
                        </div>
                        <Separator />
                        <div className="flex justify-center">
                            {[
                                { legend: 'Present', color: "#11C839" },
                                { legend: 'Absent', color: "#FA2323" },
                                { legend: 'Today', color: "blue" },
                            ].map((req, i) => (
                                <div key={i} className="flex p-3 rounded-lg justify-center items-center gap-1">
                                    <span
                                        className="flex items-center justify-center w-3 h-3 rounded-full font-bold text-xs text-white"
                                        style={{ backgroundColor: req.color, }}
                                    ></span>
                                    <div className=" font-light text-xs text-gray-500">{req.legend}</div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Pending Requests */}
                    <div className="bg-white rounded-lg border border-gray-200  p-[25px] mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="size-9 rounded-lg bg-yellow-50 flex items-center justify-center">
                                <FileText className="text-[#E7C128]" />
                            </div>
                            <h2 className="font-['Segoe_UI'] font-bold text-gray-900">Pending Requests</h2>
                            <span className="ml-auto px-[10px] py-[2px] rounded-full bg-yellow-50 font-['Segoe_UI'] font-bold text-[11.6px] text-gray-700">3</span>
                        </div>
                        <div className="max-h-[250px] overflow-y-auto">
                            {[
                                { title: 'Leave Request', submitted: 'Nov 20', approver: 'John Smith' },
                                { title: 'Reimbursement', submitted: 'Nov 18', approver: 'Finance Team' },
                                { title: 'WFH Request', submitted: 'Nov 22', approver: 'Manager' }
                            ].map((req, i) => (
                                <div key={i} className="relative p-[13px] bg-gray-50 border border-gray-100 rounded-lg mb-3 last:mb-0">
                                    <span className="absolute top-[13px] right-[13px] px-[11px] py-[3px] bg-yellow-50 border border-yellow-300 rounded-full font-['Segoe_UI'] font-bold text-xs text-gray-700">Pending</span>
                                    <div className="font-['Segoe_UI'] font-semibold text-sm text-gray-900 mb-2 pr-20">{req.title}</div>
                                    <div className="font-['Segoe_UI'] font-semibold text-[11.6px] text-gray-500 mb-1">Submitted: {req.submitted}</div>
                                    <div className="font-['Segoe_UI'] font-semibold text-[11.6px] text-gray-500">Approver: {req.approver}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}