"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Bell, Settings, Calendar1, File, FileCheck, FileText, Plus, ChevronRight, ChevronLeft, ChevronDownIcon, Check, ChevronsUpDown } from "lucide-react";
import { LEAVE_TYPES } from "@/configs/leaveType";


export default function LeaveBalanceCard() {
    const [openType, setOpenType] = React.useState(false)
    const [dateFrom, setDateFrom] = React.useState<Date | undefined>(undefined)
    const [dateTo, setDateTo] = React.useState<Date | undefined>(undefined)
    const [openDateFrom, setOpenDateFrom] = React.useState(false)
    const [openDateTo, setOpenDateTo] = React.useState(false)
    const [value, setValue] = React.useState("")

    // Clear invalid TO date
    useEffect(() => {
        if (dateFrom && dateTo && dateTo < dateFrom) {
            setDateTo(undefined);
        }
    }, [dateFrom, dateTo]);


    return (

        <div className="bg-white rounded-lg border border-gray-200  p-[25px]">
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                    <div className="size-9 rounded-lg bg-blue-50 flex items-center justify-center">
                        <File className="text-[#9BB7FF]" />

                    </div>
                    <h2 className="font-['Segoe_UI'] font-bold text-gray-900">Leave Balance</h2>

                </div>
                <Dialog >
                    <form>
                        <DialogTrigger asChild>
                            <div className="flex items-center gap-1">
                                <Plus size={14} className="text-blue-500" />
                                <h2 className="text-xs text-blue-500">Apply for leave</h2>

                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>File a Leave</DialogTitle>
                                <DialogDescription>
                                    Fill out the form below to submit your leave request.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Leave type</Label>
                                    <Popover open={openType} onOpenChange={setOpenType} >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openType}
                                                className="w-[200px] justify-between"
                                            >
                                                {value
                                                    ? LEAVE_TYPES.find((LEAVE_TYPES) => LEAVE_TYPES.value === value)?.label
                                                    : "Select type..."}
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search type..." className="h-9" />
                                                <CommandList>
                                                    <CommandEmpty>No type found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {LEAVE_TYPES.map((LEAVE_TYPES) => (
                                                            <CommandItem
                                                                key={LEAVE_TYPES.value}
                                                                value={LEAVE_TYPES.value}
                                                                onSelect={(currentValue) => {
                                                                    setValue(currentValue === value ? "" : currentValue)
                                                                    setOpenType(false)
                                                                }}
                                                            >
                                                                {LEAVE_TYPES.label}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        value === LEAVE_TYPES.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="username-1">Date range</Label>
                                    <div className="flex flex-row gap-4 px-2">
                                        <div>
                                            <p className="text-xs">From</p>
                                            <Popover open={openDateFrom} onOpenChange={setOpenDateFrom}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        id="date"
                                                        className="w-48 justify-between font-normal"
                                                    >
                                                        {dateFrom ? dateFrom.toLocaleDateString() : "Select date"}
                                                        <ChevronDownIcon />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={dateFrom}
                                                        captionLayout="dropdown"
                                                        onSelect={(date) => {
                                                            setDateFrom(date)
                                                            setOpenDateFrom(false)
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div>
                                            <p className="text-xs">To</p>
                                            <Popover open={openDateTo} onOpenChange={setOpenDateTo}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        id="date"
                                                        className="w-48 justify-between font-normal"
                                                    >
                                                        {dateTo ? dateTo.toLocaleDateString() : "Select date"}
                                                        <ChevronDownIcon />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={dateTo}
                                                        captionLayout="dropdown"
                                                        onSelect={(date) => {
                                                            setDateTo(date)
                                                            setOpenDateTo(false)
                                                        }}
                                                        disabled={(date) =>
                                                            dateFrom ? date < new Date(dateFrom.setHours(0, 0, 0, 0)) : false
                                                        }
                                                    />


                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="username-1">Reason</Label>
                                    <Textarea placeholder="Type your reason here." />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" className="bg-[#11C839] hover:bg-[#0faa33] text-white">Apply Leave</Button>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
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
    )
}