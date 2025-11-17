export const dayColors: Record<string, string> = {
  absent: "#FA2323",
  present: "#11C839",
  today: "blue",
  DEFAULT: "gray",
};

export function getColorForDay(status: string): string {
  return dayColors[status] ?? dayColors.DEFAULT;
}

// Map weekday → attendance status
export const dayStatusMap: Record<string, string> = {
  Mon: "present",
  Tue: "present",
  Wed: "absent",
  Thu: "present",
  Fri: "present",
  Sat: "today",
  Sun: "absent",
  DEFAULT: "present",
};

export function getStatusForDay(day: string): string {
  return dayStatusMap[day] ?? dayStatusMap.DEFAULT;
}
