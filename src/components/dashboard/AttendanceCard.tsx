import { getCurrentWeekDates, getCurrentWeekDatesArray } from "@/utils/dateUtil";
import { Calendar1, ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getColorForDay, getStatusForDay } from "@/configs/colors";

export default function AttendanceCard() {
  const week = getCurrentWeekDates();
  const weekDates = getCurrentWeekDatesArray();

  return (
    <div className="bg-white rounded-lg border border-gray-200 pb-1 p-[25px] ">
      <div className="flex justify-between gap-2 ">
        <div className="flex items-center">
          <div className="size-9 rounded-lg bg-green-50 flex items-center justify-center">
            <Calendar1 className="text-[#1CAA3A]" />
          </div>
          <h2 className="font-['Segoe_UI'] font-bold text-gray-900">Attendance</h2>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <ChevronLeft size={16} />
          <p className="text-xs">
            {week.monday} - {week.sunday}
          </p>
          <ChevronRight size={16} />
        </div>
      </div>

      <div className="max-h-[250px] flex">
        {weekDates.map((date, i) => {
          const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
          const dayNumber = date.getDate();
          const status = getStatusForDay(dayName); // map day → status
          const color = getColorForDay(status);    // get color for status

          return (
            <div key={i} className="flex flex-col p-2 rounded-lg justify-center items-center mb-1">
              <div className="font-light text-xs text-gray-500 mb-2">{dayName}</div>
              <span
                className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs text-white"
                style={{ backgroundColor: color }}
              >
                {dayNumber}
              </span>
            </div>
          );
        })}
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
              style={{ backgroundColor: req.color }}
            ></span>
            <div className="font-light text-xs text-gray-500">{req.legend}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
