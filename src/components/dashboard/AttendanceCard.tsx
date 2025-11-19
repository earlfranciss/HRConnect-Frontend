import { Calendar } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function AttendanceCard() {
    return (
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
                    <div key={i} className="flex flex-col p-1 rounded-lg justify-center items-center mb-1 ">
                        <div className=" font-light text-xs text-gray-900 mb-2">{req.day}</div>
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
                        <div className=" font-light text-xs text-gray-900">{req.legend}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}