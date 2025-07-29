export interface TimerInstance {
  id: string
  selectedApp: string
  taskName: string
  secondsElapsed: number
  isRunning: boolean
  isPaused: boolean
  completed: boolean
  teamMember: string
}

export interface TaskEntry {
  id: string
  appName: string
  taskName: string
  durationSeconds: number
  teamMember: string
  isEditing?: boolean
  completed?: boolean
}
