import { formatDistanceToNow, format, isToday, isTomorrow, isYesterday } from "date-fns";

export function relativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function friendlyDate(date: string | Date): string {
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d, yyyy");
}

export function calendarDate(date: string | Date): string {
  return format(new Date(date), "MMM d");
}

export function fullDate(date: string | Date): string {
  return format(new Date(date), "MMMM d, yyyy");
}

export function yearOnly(date: string | null | undefined): string {
  if (!date) return "";
  return format(new Date(date), "yyyy");
}
