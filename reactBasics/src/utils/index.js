export function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTimeString(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  // Pad with leading zero if needed (e.g., 9 -> "09")
  const hh = String(hours).padStart(2, "0");
  const mm = String(mins).padStart(2, "0");
  return `${hh}:${mm}`;
}

export const isOverLapping = (event, newEvent) => {
  return event.start < newEvent.end && event.end > newEvent.start;
};
