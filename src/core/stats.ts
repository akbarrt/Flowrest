import type { Session } from './types'

function localDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function countSessionsToday(sessions: Session[], now: Date = new Date()): number {
  const today = localDateKey(now)

  return sessions.reduce((count, session) => {
    const date = new Date(session.date)

    if (Number.isNaN(date.getTime())) {
      return count
    }

    return localDateKey(date) === today ? count + 1 : count
  }, 0)
}
