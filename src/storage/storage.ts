import type { Session } from '../core/types'

export interface SessionStorage {
  getSessions(): Promise<Session[]>
  addSession(session: Session): Promise<void>
  clearSessions(): Promise<void>
}
