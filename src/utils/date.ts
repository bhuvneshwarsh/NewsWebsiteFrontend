export function parseApiTimestamp(timestamp: string): Date {
  const includesTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(timestamp);
  const isIsoTimestamp = /^\d{4}-\d{2}-\d{2}T/.test(timestamp);

  return new Date(
    isIsoTimestamp && !includesTimezone ? `${timestamp}Z` : timestamp
  );
}
