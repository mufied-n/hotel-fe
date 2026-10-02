export const DEMO_SERVER_TIME = '2026-10-03T03:00:00.000Z'

export function demoTimeAfter(minutes: number): string {
  return new Date(Date.parse(DEMO_SERVER_TIME) + minutes * 60_000).toISOString()
}
