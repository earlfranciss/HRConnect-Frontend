"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, ChevronsUpDown, Check } from "lucide-react";
import { LEAVE_TYPES } from "@/configs/leaveType";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";

type LeaveType = "Emergency Leave" | "Vacation Leave" | "Sick Leave";

type LeaveRequestData = {
    used_days: number;
    reason: string;
};

interface ApplyLeaveProps {
    onLeaveApplied?: () => void;
}

export default function ApplyLeave({ onLeaveApplied }: ApplyLeaveProps) {
    const [openType, setOpenType] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [value, setValue] = useState<LeaveType | "">("");
    const [days, setDays] = useState(1);
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const balanceApiMap: Record<LeaveType, () => Promise<any>> = {
        "Emergency Leave": api.getEmergencyLeave,
        "Vacation Leave": api.getVacationLeave,
        "Sick Leave": api.getSickLeave,
    };

    const leaveApiMap: Record<LeaveType, (data: LeaveRequestData) => Promise<any>> = {
        "Emergency Leave": api.createEmergencyLeave,
        "Vacation Leave": api.createVacationLeave,
        "Sick Leave": api.createSickLeave,
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!value) {
            toast.warning("Please select a leave type.");
            return;
        }

        const selectedApi = leaveApiMap[value];
        const getBalanceApi = balanceApiMap[value];

        if (!selectedApi || !getBalanceApi) {
            toast.error("Invalid leave type.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Fetch current balance
            const balance = await getBalanceApi();
            const remaining = balance.total_days - balance.used_days;

            // Validate User Input
            if (days > remaining) {
                toast.error(`Not enough balance. You have only ${remaining} day(s) left.`);
                setIsSubmitting(false);
                return;
            }

            // Submit leave if valid
            await toast.promise(
                selectedApi({ used_days: days, reason }),
                {
                    loading: "Submitting leave...",
                    success: "Leave request submitted!",
                    error: "Failed to submit leave",
                }
            );

            // Reset form
            setValue("");
            setDays(1);
            setReason("");
            setDialogOpen(false);
            onLeaveApplied?.();

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            {/* Button to open dialog */}
            <DialogTrigger asChild>
                <h2 className="text-xs sm:text-sm">Apply for leave</h2>
            </DialogTrigger>

            <DialogContent className="w-[calc(100vw-2rem)] sm:w-full max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">File a Leave</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                        Fill out the form below to submit your leave request.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-3 sm:gap-4">
                    {/* Leave Type */}
                    <div className="grid gap-2 sm:gap-3">
                        <Label htmlFor="leave-type" className="text-xs sm:text-sm">Leave type</Label>
                        <Popover open={openType} onOpenChange={setOpenType}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openType}
                                    className="w-full sm:w-[200px] justify-between text-xs sm:text-sm"
                                >
                                    {value ? LEAVE_TYPES.find((lt) => lt.value === value)?.label : "Select type..."}
                                    <ChevronsUpDown className="opacity-50 w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search type..." className="h-8 sm:h-9 text-xs sm:text-sm" />
                                    <CommandList>
                                        <CommandEmpty className="text-xs sm:text-sm">No type found.</CommandEmpty>
                                        <CommandGroup>
                                            {LEAVE_TYPES.map((lt) => (
                                                <CommandItem
                                                    key={lt.value}
                                                    value={lt.value}
                                                    onSelect={(currentValue) => {
                                                        setValue(currentValue as LeaveType);
                                                        setOpenType(false);
                                                    }}
                                                    className="text-xs sm:text-sm"
                                                >
                                                    {lt.label}
                                                    <Check className={cn("ml-auto w-4 h-4", value === lt.value ? "opacity-100" : "opacity-0")} />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Number of Days */}
                    <div className="grid gap-2 sm:gap-3">
                        <Label htmlFor="no-of-days" className="text-xs sm:text-sm">Number of days</Label>
                        <Input
                            id="no-of-days"
                            type="number"
                            placeholder="Enter number of days"
                            min={1}
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="text-xs sm:text-sm"
                        />
                    </div>

                    {/* Reason */}
                    <div className="grid gap-2 sm:gap-3">
                        <Label htmlFor="reason" className="text-xs sm:text-sm">Reason</Label>
                        <Textarea
                            id="reason"
                            placeholder="Type your reason here."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="text-xs sm:text-sm min-h-[80px] sm:min-h-[100px]"
                        />
                    </div>

                    {/* Form actions */}
                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button variant="outline" type="button" className="text-xs sm:text-sm">Cancel</Button>
                        </DialogClose>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm"
                        >
                            {isSubmitting ? "Submitting..." : "Apply Leave"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}