export function getCurrentWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ...
  
  // Calculate Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  // Calculate Sunday
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  // Format dates
  const options = { month: 'short', day: 'numeric' };
  return {
    monday: monday.toLocaleDateString('en-US', options),
    sunday: sunday.toLocaleDateString('en-US', options),
  };
}

export const getCurrentWeekDatesArray = (): Date[] => {
  const now = new Date();
  const first = now.getDate() - now.getDay() + 1; // Monday
  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    week.push(new Date(now.getFullYear(), now.getMonth(), first + i));
  }
  return week;
};
