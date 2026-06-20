import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import {
  addAnnouncement,
  addMessage,
  addTask,
  ensureThread,
  initStore,
  readStore,
} from './storage'

export const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [store, setStore] = useState(null)

  useEffect(() => {
    initStore()
    setStore(readStore())
  }, [])

  const refresh = useCallback(() => {
    setStore(readStore())
  }, [])

  const actions = useMemo(
    () => ({
      createAnnouncement: (payload) => {
        addAnnouncement(payload)
        refresh()
      },
      createTask: (payload) => {
        addTask(payload)
        refresh()
      },
      sendMessage: (payload) => {
        addMessage(payload)
        refresh()
      },
      ensureThread: (participantIds) => {
        const thread = ensureThread(participantIds)
        refresh()
        return thread
      },
    }),
    [refresh]
  )

  const value = useMemo(
    () => ({
      store,
      refresh,
      ...actions,
    }),
    [actions, refresh, store]
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}
