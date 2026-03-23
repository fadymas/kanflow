export type Priority = 'high' | 'medium' | 'low'

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  subtasks: Subtask[]
  priority?: Priority
}

export interface Column {
  id: string
  title: string
  color: string
  tasks: Task[]
}

export interface Board {
  id: string
  title: string
  icon: string
  columns: Column[]
}

export const BOARDS: Board[] = [
  {
    id: 'platform-launch',
    title: 'Platform Launch',
    icon: 'grid',
    columns: [
      {
        id: 'todo',
        title: 'TODO',
        color: '#49C4E5',
        tasks: [
          {
            id: 't1',
            title: 'Build UI for onboarding flow',
            subtasks: [
              { id: 's1', title: 'Sign up page', completed: false },
              { id: 's2', title: 'Sign in page', completed: false },
              { id: 's3', title: 'Welcome page', completed: false },
            ],
          },
          {
            id: 't2',
            title: 'Build UI for search page',
            subtasks: [
              { id: 's4', title: 'Search bar', completed: false },
            ],
          },
          {
            id: 't3',
            title: 'Design system documentation',
            subtasks: [
              { id: 's5', title: 'Add design tokens', completed: true },
              { id: 's6', title: 'Document usage', completed: true },
              { id: 's7', title: 'Create examples', completed: false },
              { id: 's8', title: 'Add component specs', completed: false },
              { id: 's9', title: 'Review with team', completed: false },
              { id: 's10', title: 'Publish docs', completed: false },
            ],
          },
          {
            id: 't4',
            title: 'QA testing on staging',
            subtasks: [
              { id: 's11', title: 'Full regression', completed: false },
            ],
          },
        ],
      },
      {
        id: 'doing',
        title: 'DOING',
        color: '#8471F2',
        tasks: [
          {
            id: 't5',
            title: 'Design settings and profile',
            subtasks: [
              { id: 's12', title: 'Settings page', completed: true },
              { id: 's13', title: 'Profile page', completed: false },
              { id: 's14', title: 'Edit profile modal', completed: false },
            ],
          },
          {
            id: 't6',
            title: 'Add account management',
            subtasks: [
              { id: 's15', title: 'Invite members', completed: true },
              { id: 's16', title: 'Manage roles', completed: true },
            ],
          },
          {
            id: 't7',
            title: 'Refactor backend auth',
            priority: 'high',
            subtasks: [
              { id: 's17', title: 'OAuth integration', completed: false },
            ],
          },
        ],
      },
      {
        id: 'done',
        title: 'DONE',
        color: '#67E2AE',
        tasks: [
          {
            id: 't8',
            title: 'Competitor analysis',
            subtasks: [
              { id: 's18', title: 'Research features', completed: true },
              { id: 's19', title: 'Compile report', completed: true },
            ],
          },
          {
            id: 't9',
            title: 'Market research',
            subtasks: [
              { id: 's20', title: 'User interviews', completed: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'marketing-plan',
    title: 'Marketing Plan',
    icon: 'campaign',
    columns: [
      {
        id: 'todo',
        title: 'TODO',
        color: '#49C4E5',
        tasks: [
          {
            id: 'mt1',
            title: 'Refactor backend auth',
            priority: 'high',
            subtasks: [
              { id: 'ms1', title: 'OAuth flow', completed: false },
              { id: 'ms2', title: 'Token refresh', completed: false },
              { id: 'ms3', title: 'Session management', completed: false },
            ],
          },
          {
            id: 'mt2',
            title: 'Design system audit',
            subtasks: [
              { id: 'ms4', title: 'Audit colors', completed: true },
              { id: 'ms5', title: 'Audit spacing', completed: true },
              { id: 'ms6', title: 'Audit typography', completed: false },
              { id: 'ms7', title: 'Create report', completed: false },
              { id: 'ms8', title: 'Implement fixes', completed: false },
            ],
          },
          {
            id: 'mt3',
            title: 'Update marketing assets',
            subtasks: [
              { id: 'ms9', title: 'Create banner', completed: true },
            ],
          },
          {
            id: 'mt4',
            title: 'Review competitor pricing',
            subtasks: [
              { id: 'ms10', title: 'Gather data', completed: false },
              { id: 'ms11', title: 'Analysis deck', completed: false },
            ],
          },
        ],
      },
      {
        id: 'doing',
        title: 'DOING',
        color: '#8471F2',
        tasks: [
          {
            id: 'mt5',
            title: 'Email campaign Q2',
            subtasks: [
              { id: 'ms12', title: 'Draft copy', completed: true },
              { id: 'ms13', title: 'Design templates', completed: false },
            ],
          },
          {
            id: 'mt6',
            title: 'Social media strategy',
            subtasks: [
              { id: 'ms14', title: 'Content calendar', completed: false },
            ],
          },
        ],
      },
      {
        id: 'done',
        title: 'DONE',
        color: '#67E2AE',
        tasks: [
          {
            id: 'mt7',
            title: 'Brand guidelines v2',
            subtasks: [
              { id: 'ms15', title: 'Colors & fonts', completed: true },
              { id: 'ms16', title: 'Logo usage', completed: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    icon: 'map',
    columns: [
      {
        id: 'now',
        title: 'NOW',
        color: '#49C4E5',
        tasks: [
          {
            id: 'rt1',
            title: 'Launch v2.0 beta',
            subtasks: [
              { id: 'rs1', title: 'Feature freeze', completed: true },
              { id: 'rs2', title: 'Internal QA', completed: false },
            ],
          },
        ],
      },
      {
        id: 'next',
        title: 'NEXT',
        color: '#8471F2',
        tasks: [
          {
            id: 'rt2',
            title: 'Mobile app release',
            subtasks: [
              { id: 'rs3', title: 'iOS review', completed: false },
              { id: 'rs4', title: 'Android review', completed: false },
            ],
          },
        ],
      },
      {
        id: 'later',
        title: 'LATER',
        color: '#67E2AE',
        tasks: [
          {
            id: 'rt3',
            title: 'AI features integration',
            subtasks: [
              { id: 'rs5', title: 'Research', completed: false },
              { id: 'rs6', title: 'Prototype', completed: false },
              { id: 'rs7', title: 'Ship', completed: false },
            ],
          },
        ],
      },
    ],
  },
]
