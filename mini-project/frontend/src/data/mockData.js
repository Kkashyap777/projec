export const currentUser = {
  id: 'u1',
  name: 'Aarav Singh',
  role: 'mentor', // 'mentor' | 'mentee'
  title: 'Senior Mentor, CSE Dept.',
  avatarUrl: '',
}

export const users = [
  currentUser,
  {
    id: 'u2',
    name: 'Riya Sharma',
    role: 'mentee',
    title: 'B.Tech CSE • 2nd Year',
    avatarUrl: '',
  },
  {
    id: 'u3',
    name: 'Mohit Verma',
    role: 'mentee',
    title: 'B.Tech IT • 3rd Year',
    avatarUrl: '',
  },
]

export const announcementsSeed = [
  {
    id: 'a1',
    title: 'Welcome to GCU Mentoring',
    body: 'Use announcements, tasks and messages to stay aligned. Keep communication professional and consistent.',
    authorId: 'u1',
    createdAt: '2026-03-01T10:00:00.000Z',
    tags: ['general'],
  },
  {
    id: 'a2',
    title: 'Weekly check-in',
    body: 'Please share your weekly progress by Friday evening (coursework, assignments, and any blockers).',
    authorId: 'u1',
    createdAt: '2026-03-01T12:30:00.000Z',
    tags: ['academics'],
  },
]

export const threadsSeed = [
  {
    id: 't1',
    participantIds: ['u1', 'u2'],
    lastMessageAt: '2026-03-01T13:00:00.000Z',
  },
  {
    id: 't2',
    participantIds: ['u1', 'u3'],
    lastMessageAt: '2026-03-01T15:10:00.000Z',
  },
]

export const messagesSeed = [
  {
    id: 'm1',
    threadId: 't1',
    senderId: 'u2',
    text: 'Hi mentor, can you guide me on time management for DSA practice?',
    createdAt: '2026-03-01T12:45:00.000Z',
  },
  {
    id: 'm2',
    threadId: 't1',
    senderId: 'u1',
    text: 'Sure. Start with 45–60 minutes/day, 5 days/week. Track topics and revise weekly. I will share a template.',
    createdAt: '2026-03-01T13:00:00.000Z',
  },
  {
    id: 'm3',
    threadId: 't2',
    senderId: 'u3',
    text: 'I am struggling with DBMS normalization. Any resources?',
    createdAt: '2026-03-01T15:05:00.000Z',
  },
  {
    id: 'm4',
    threadId: 't2',
    senderId: 'u1',
    text: 'Yes. I will share notes + a short video playlist. Also we can do a 20-min call.',
    createdAt: '2026-03-01T15:10:00.000Z',
  },
]

export const tasksSeed = [
  {
    id: 'task1',
    title: 'Submit weekly progress update',
    description: 'Share what you learned, what you built, and blockers.',
    assignedToId: 'u2',
    assignedById: 'u1',
    dueDate: '2026-03-07',
    status: 'assigned', // assigned | in_progress | done
    createdAt: '2026-03-01T11:00:00.000Z',
  },
  {
    id: 'task2',
    title: 'Revise DBMS normalization (1NF–BCNF)',
    description: 'Solve 10 practice questions and note mistakes.',
    assignedToId: 'u3',
    assignedById: 'u1',
    dueDate: '2026-03-06',
    status: 'in_progress',
    createdAt: '2026-03-01T14:30:00.000Z',
  },
]

export const resources = [
  {
    id: 'r1',
    title: 'DSA Roadmap (beginner to intermediate)',
    type: 'link', // link | pdf | doc
    url: 'https://neetcode.io/roadmap',
    tag: 'academics',
  },
  {
    id: 'r2',
    title: 'DBMS Normalization Notes',
    type: 'link',
    url: 'https://www.geeksforgeeks.org/normal-forms-in-dbms/',
    tag: 'academics',
  },
]
