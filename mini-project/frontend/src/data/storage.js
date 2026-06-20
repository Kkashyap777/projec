import {
  announcementsSeed,
  messagesSeed,
  tasksSeed,
  threadsSeed,
  users,
} from './mockData'

const STORAGE_KEY = 'gcu-mentoring-v1'

function nowIso() {
  return new Date().toISOString()
}

export function initStore() {
  const existing = localStorage.getItem(STORAGE_KEY)
  if (existing) return

  const initial = {
    users,
    announcements: announcementsSeed,
    threads: threadsSeed,
    messages: messagesSeed,
    tasks: tasksSeed,
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
}

export function readStore() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function writeStore(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function addAnnouncement({ title, body, authorId, tags = [] }) {
  const store = readStore()
  const announcement = {
    id: `a_${crypto.randomUUID()}`,
    title,
    body,
    authorId,
    createdAt: nowIso(),
    tags,
  }
  const next = {
    ...store,
    announcements: [announcement, ...(store?.announcements ?? [])],
  }
  writeStore(next)
  return announcement
}

export function addTask({
  title,
  description,
  assignedToId,
  assignedById,
  dueDate,
}) {
  const store = readStore()
  const task = {
    id: `task_${crypto.randomUUID()}`,
    title,
    description,
    assignedToId,
    assignedById,
    dueDate,
    status: 'assigned',
    createdAt: nowIso(),
  }
  const next = { ...store, tasks: [task, ...(store?.tasks ?? [])] }
  writeStore(next)
  return task
}

export function addMessage({ threadId, senderId, text }) {
  const store = readStore()
  const message = {
    id: `m_${crypto.randomUUID()}`,
    threadId,
    senderId,
    text,
    createdAt: nowIso(),
  }
  const next = {
    ...store,
    messages: [...(store?.messages ?? []), message],
    threads: (store?.threads ?? []).map((t) =>
      t.id === threadId ? { ...t, lastMessageAt: message.createdAt } : t
    ),
  }
  writeStore(next)
  return message
}

export function ensureThread(participantIds) {
  const store = readStore()
  const normalized = [...participantIds].sort()
  const existing = (store?.threads ?? []).find((t) => {
    const a = [...t.participantIds].sort()
    return a.join('|') === normalized.join('|')
  })
  if (existing) return existing

  const thread = {
    id: `t_${crypto.randomUUID()}`,
    participantIds: normalized,
    lastMessageAt: nowIso(),
  }
  const next = { ...store, threads: [thread, ...(store?.threads ?? [])] }
  writeStore(next)
  return thread
}
