/**
 * Business Hours Utility for Email Scheduling
 * Ensures emails are only sent during Mon-Fri 9am-6pm EST
 */

// EST timezone offset (note: this doesn't account for DST, but we use America/New_York for proper handling)
const BUSINESS_START_HOUR = 9;  // 9 AM EST
const BUSINESS_END_HOUR = 18;   // 6 PM EST
const TIMEZONE = 'America/New_York';

/**
 * Check if a given date/time is within business hours (Mon-Fri 9am-6pm EST)
 */
export function isBusinessHours(date: Date = new Date()): boolean {
  // Convert to EST
  const estTime = new Date(date.toLocaleString('en-US', { timeZone: TIMEZONE }));
  const dayOfWeek = estTime.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = estTime.getHours();

  // Check if it's a weekday (Mon-Fri = 1-5)
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

  // Check if it's within business hours
  const isWithinHours = hour >= BUSINESS_START_HOUR && hour < BUSINESS_END_HOUR;

  return isWeekday && isWithinHours;
}

/**
 * Get the next available business hour time
 * If currently in business hours, returns the input time
 * Otherwise, returns the start of the next business day
 */
export function getNextBusinessHour(baseDate: Date = new Date()): Date {
  // Start with the base date
  let targetDate = new Date(baseDate);

  // Get the EST representation
  const getESTDate = (d: Date) => {
    return new Date(d.toLocaleString('en-US', { timeZone: TIMEZONE }));
  };

  // Maximum iterations to prevent infinite loop (7 days should cover any scenario)
  let iterations = 0;
  const maxIterations = 7 * 24; // 7 days worth of hours

  while (iterations < maxIterations) {
    const estDate = getESTDate(targetDate);
    const dayOfWeek = estDate.getDay();
    const hour = estDate.getHours();

    // If it's a weekday and within business hours, we're good
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= BUSINESS_START_HOUR && hour < BUSINESS_END_HOUR) {
      return targetDate;
    }

    // If it's a weekday but before business hours, jump to 9am
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour < BUSINESS_START_HOUR) {
      // Set to 9am the same day
      const hoursToAdd = BUSINESS_START_HOUR - hour;
      targetDate = new Date(targetDate.getTime() + hoursToAdd * 60 * 60 * 1000);
      // Clear minutes/seconds for clean scheduling
      const estTarget = getESTDate(targetDate);
      const minutesOffset = estTarget.getMinutes();
      targetDate = new Date(targetDate.getTime() - minutesOffset * 60 * 1000);
      return targetDate;
    }

    // If it's after business hours or weekend, jump to next day's 9am
    targetDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);

    // Set to 9am
    const estTarget = getESTDate(targetDate);
    const currentHour = estTarget.getHours();
    if (currentHour !== BUSINESS_START_HOUR) {
      const hourDiff = BUSINESS_START_HOUR - currentHour;
      targetDate = new Date(targetDate.getTime() + hourDiff * 60 * 60 * 1000);
    }

    // Clear minutes/seconds
    const minutesOffset = getESTDate(targetDate).getMinutes();
    targetDate = new Date(targetDate.getTime() - minutesOffset * 60 * 1000);

    iterations++;
  }

  // Fallback - should never reach here
  return targetDate;
}

/**
 * Schedule an email to be sent after a delay, but only during business hours
 * @param hoursDelay - Minimum hours to wait before sending
 * @returns ISO string for Resend's scheduledAt parameter
 */
export function getBusinessHourScheduleTime(hoursDelay: number): string {
  // Calculate the earliest possible send time
  const earliestTime = new Date(Date.now() + hoursDelay * 60 * 60 * 1000);

  // Find the next business hour at or after this time
  const scheduledTime = getNextBusinessHour(earliestTime);

  return scheduledTime.toISOString();
}

/**
 * Get descriptive info about when an email will be sent
 */
export function describeScheduledTime(scheduledAt: string): string {
  const date = new Date(scheduledAt);
  return date.toLocaleString('en-US', {
    timeZone: TIMEZONE,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }) + ' EST';
}
