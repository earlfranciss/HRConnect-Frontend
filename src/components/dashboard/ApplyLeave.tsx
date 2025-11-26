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

    // Validation error states
    const [typeError, setTypeError] = useState("");
    const [daysError, setDaysError] = useState("");
    const [reasonError, setReasonError] = useState("");

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

    // Reset errors when dialog closes
    useEffect(() => {
        if (!dialogOpen) {
            setTypeError("");
            setDaysError("");
            setReasonError("");
        }
    }, [dialogOpen]);

    const validateInputs = () => {
        let isValid = true;

        // Reset errors
        setTypeError("");
        setDaysError("");
        setReasonError("");

        // Validate leave type
        if (!value) {
            setTypeError("Please select a leave type.");
            isValid = false;
        }

        // Validate number of days
        if (!days || days < 1) {
            setDaysError("Please enter at least 1 day.");
            isValid = false;
        } else if (days > 365) {
            setDaysError("Days cannot exceed 365.");
            isValid = false;
        } else if (!Number.isInteger(days)) {
            setDaysError("Days must be a whole number.");
            isValid = false;
        }

        // Validate reason
        if (!reason.trim()) {
            setReasonError("Please provide a reason for your leave.");
            isValid = false;
        } else if (reason.trim().length > 500) {
            setReasonError("Reason cannot exceed 500 characters.");
            isValid = false;
        }

        return isValid;
    };

    const handleCancel = () => {
        // Clear form fields
        setValue("");
        setDays(1);
        setReason("");
        
        // Clear errors
        setTypeError("");
        setDaysError("");
        setReasonError("");
        
        // Close dialog
        setDialogOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Validate inputs first
        if (!validateInputs()) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        // Type guard to ensure value is a valid LeaveType
        if (!value) {
            toast.error("Please select a leave type.");
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

            // Validate User Input against available balance
            if (days > remaining) {
                toast.error(`Not enough balance. You have only ${remaining} day(s) left.`);
                setDaysError(`Only ${remaining} day(s) remaining.`);
                setIsSubmitting(false);
                return;
            }

            // Submit leave if valid
            await toast.promise(
                selectedApi({ used_days: days, reason: reason.trim() }),
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
            setTypeError("");
            setDaysError("");
            setReasonError("");
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
                        <Label htmlFor="leave-type" className="text-xs sm:text-sm">
                            Leave type <span className="text-red-500">*</span>
                        </Label>
                        <Popover open={openType} onOpenChange={setOpenType}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openType}
                                    disabled={isSubmitting}
                                    className={cn(
                                        "w-full justify-between text-xs sm:text-sm",
                                        typeError && "border-red-500"
                                    )}
                                >
                                    {value ? LEAVE_TYPES.find((lt) => lt.value === value)?.label : "Select type..."}
                                    <ChevronsUpDown className="opacity-50 w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[450px] p-0">
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
                                                        setTypeError(""); // Clear error on selection
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
                        {typeError && (
                            <p className="text-xs text-red-500">{typeError}</p>
                        )}
                    </div>

                    {/* Number of Days */}
                    <div className="grid gap-2 sm:gap-3">
                        <Label htmlFor="no-of-days" className="text-xs sm:text-sm">
                            Number of days <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="no-of-days"
                            type="number"
                            placeholder="Enter number of days"
                            min={1}
                            max={365}
                            value={days}
                            onChange={(e) => {
                                setDays(Number(e.target.value));
                                setDaysError(""); // Clear error on change
                            }}
                            disabled={isSubmitting}
                            className={cn(
                                "text-xs sm:text-sm",
                                daysError && "border-red-500"
                            )}
                        />
                        {daysError && (
                            <p className="text-xs text-red-500">{daysError}</p>
                        )}
                    </div>

                    {/* Reason */}
                    <div className="grid gap-2 sm:gap-3">
                        <Label htmlFor="reason" className="text-xs sm:text-sm">
                            Reason <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder="Type your reason here."
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                setReasonError(""); // Clear error on change
                            }}
                            disabled={isSubmitting}
                            maxLength={500}
                            className={cn(
                                "text-xs sm:text-sm min-h-[80px] sm:min-h-[100px]",
                                reasonError && "border-red-500"
                            )}
                        />
                        <div className="flex justify-between items-center">
                            {reasonError ? (
                                <p className="text-xs text-red-500">{reasonError}</p>
                            ) : (
                                <p className="text-xs text-gray-400">
                                    {reason.length}/500 characters
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Form actions */}
                    <DialogFooter className="gap-2">
                        <Button 
                            variant="outline" 
                            type="button" 
                            className="text-xs sm:text-sm"
                            disabled={isSubmitting}
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                "Apply Leave"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}