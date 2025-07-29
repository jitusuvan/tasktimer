import  { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ManageApps from './components/ManagePanel/ManageApps'
import ManageTeamMembers from './components/ManagePanel/ManageTeamMembers'
import TimerCard from './components/TimerCard/TimerCard'
import TaskList from './components/TaskList/TaskList'
import type { TimerInstance, TaskEntry } from './types'
import './App.css'

function App() {
  // State initialization from localStorage or defaults
  const [appNames, setAppNames] = useState<string[]>(() => {
    try {
      const data = localStorage.getItem('appNames')
      if (data) {
        const arr = JSON.parse(data)
        if (Array.isArray(arr)) return arr
      }
    } catch {}
    return ['General', 'Paisavara']
  })

  const [teamMembers, setTeamMembers] = useState<string[]>(() => {
    try {
      const data = localStorage.getItem('teamMembers')
      if (data) {
        const arr = JSON.parse(data)
        if (Array.isArray(arr)) return arr
      }
    } catch {}
    return ['Default Member']
  })

  const [newAppName, setNewAppName] = useState('')
  const [newTeamMember, setNewTeamMember] = useState('')

  const [timers, setTimers] = useState<TimerInstance[]>(() => {
    try {
      const data = localStorage.getItem('timers')
      if (data) {
        const arr = JSON.parse(data)
        if (Array.isArray(arr)) return arr
      }
    } catch {}
    return []
  })

  const [tasks, setTasks] = useState<TaskEntry[]>(() => {
    try {
      const data = localStorage.getItem('tasks')
      if (data) {
        const arr = JSON.parse(data)
        if (Array.isArray(arr)) return arr
      }
    } catch {}
    return []
  })

  const [manageOpen, setManageOpen] = useState(false)

  const timerIntervals = useRef<Record<string, number>>({})

  // Persist states to localStorage
  useEffect(() => {
    localStorage.setItem('appNames', JSON.stringify(appNames))
  }, [appNames])

  useEffect(() => {
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers))
  }, [teamMembers])

  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers))
  }, [timers])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Ensure at least one timer exists on load
  useEffect(() => {
    if (timers.length === 0 && appNames.length > 0) {
      setTimers([
        {
          id: uuidv4(),
          selectedApp: appNames[0],
          taskName: '',
          teamMember: teamMembers[0] || '',
          secondsElapsed: 0,
          isRunning: false,
          isPaused: false,
          completed: false,
        },
      ])
    }
  }, [timers, appNames, teamMembers])

  // Timer intervals management - only one timer running and not paused at a time
  useEffect(() => {
    const runningTimers = timers.filter((t) => t.isRunning && !t.isPaused)
    const runningId = runningTimers.length === 1 ? runningTimers[0].id : null

    timers.forEach((timer) => {
      const hasInterval = timerIntervals.current[timer.id] !== undefined

      if (timer.id === runningId) {
        if (!hasInterval) {
          const intervalId = window.setInterval(() => {
            setTimers((prev) =>
              prev.map((t) =>
                t.id === timer.id ? { ...t, secondsElapsed: t.secondsElapsed + 1 } : t
              )
            )
          }, 1000)
          timerIntervals.current[timer.id] = intervalId
        }
      } else {
        if (hasInterval) {
          clearInterval(timerIntervals.current[timer.id])
          delete timerIntervals.current[timer.id]
        }
        if (timer.isRunning && !timer.isPaused) {
          updateTimer(timer.id, { isPaused: true })
        }
      }
    })

    return () => {
      Object.values(timerIntervals.current).forEach(clearInterval)
      timerIntervals.current = {}
    }
  }, [timers])

  // Timer update helper
  const updateTimer = (id: string, changes: Partial<TimerInstance>) => {
    setTimers((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)))
  }

  // Timer handlers — Start, Pause, Resume, Stop
  const handleStart = (id: string) => {
    const timer = timers.find((t) => t.id === id)
    if (!timer) return
    if (!timer.taskName.trim()) {
      alert('Please enter a task name')
      return
    }
    if (!timer.teamMember.trim()) {
      alert('Please select a team member')
      return
    }
    setTimers((prev) =>
      prev.map((t) => (t.id !== id && t.isRunning && !t.isPaused ? { ...t, isPaused: true } : t))
    )
    updateTimer(id, { isRunning: true, isPaused: false, secondsElapsed: 0 })
  }

  const handlePause = (id: string) => updateTimer(id, { isPaused: true })

  const handleResume = (id: string) => {
    setTimers((prev) =>
      prev.map((t) => (t.id !== id && t.isRunning ? { ...t, isPaused: true } : t))
    )
    updateTimer(id, { isPaused: false, isRunning: true })
  }

  const handleStop = (id: string) => {
    const timer = timers.find((t) => t.id === id)
    if (!timer) return
    if (timer.secondsElapsed === 0) {
      alert('Timer has not run yet')
      return
    }
    const newTask: TaskEntry = {
      id: uuidv4(),
      appName: timer.selectedApp,
      taskName: timer.taskName.trim() || 'Untitled Task',
      durationSeconds: timer.secondsElapsed,
      teamMember: timer.teamMember.trim(),
    }
    setTasks((prev) => [...prev, newTask])
    setTimers((prev) => prev.filter((t) => t.id !== id))
    if (timerIntervals.current[id]) {
      clearInterval(timerIntervals.current[id])
      delete timerIntervals.current[id]
    }
  }

  // Clear all timers and tasks
  const handleClearAll = () => {
    Object.values(timerIntervals.current).forEach(clearInterval)
    timerIntervals.current = {}

    setTimers([
      {
        id: uuidv4(),
        selectedApp: appNames.length > 0 ? appNames[0] : 'General',
        taskName: '',
        teamMember: teamMembers[0] || '',
        secondsElapsed: 0,
        isRunning: false,
        isPaused: false,
        completed: false,
      },
    ])

    setTasks([])
  }

  // Manage Apps handlers (existing from your code)
  const handleAddApp = () => {
    const trimmed = newAppName.trim()
    if (!trimmed) {
      alert('App name cannot be empty')
      return
    }
    if (appNames.includes(trimmed)) {
      alert('App already exists')
      return
    }
    setAppNames([...appNames, trimmed])
    setNewAppName('')
  }

  const handleEditApp = (index: number, value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (appNames.includes(trimmed) && appNames[index] !== trimmed) return
    setAppNames(appNames.map((app, i) => (i === index ? trimmed : app)))
  }

  const handleDeleteApp = (index: number) => {
    if (
      window.confirm(
        `Delete app "${appNames[index]}"? This will affect existing tasks and timers.`
      )
    ) {
      const appToDelete = appNames[index]
      setAppNames(appNames.filter((_, i) => i !== index))
      const defaultApp = appNames.includes('General')
        ? 'General'
        : appNames[0] || ''
      setTasks(tasks.map((t) => (t.appName === appToDelete ? { ...t, appName: defaultApp } : t)))
      setTimers(
        timers.map((t) =>
          t.selectedApp === appToDelete ? { ...t, selectedApp: defaultApp } : t
        )
      )
    }
  }

  // Manage Team Members handlers
  const handleAddTeamMember = () => {
    const trimmed = newTeamMember.trim()
    if (!trimmed) {
      alert('Team member name cannot be empty')
      return
    }
    if (teamMembers.includes(trimmed)) {
      alert('Team member already exists')
      return
    }
    setTeamMembers([...teamMembers, trimmed])
    setNewTeamMember('')
  }

  const handleEditTeamMember = (index: number, value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (teamMembers.includes(trimmed) && teamMembers[index] !== trimmed) return
    const oldTeam = teamMembers[index]
    setTeamMembers(teamMembers.map((tm, i) => (i === index ? trimmed : tm)))
    setTasks(tasks.map((t) => (t.teamMember === oldTeam ? { ...t, teamMember: trimmed } : t)))
    setTimers(timers.map((t) => (t.teamMember === oldTeam ? { ...t, teamMember: trimmed } : t)))
  }

  const handleDeleteTeamMember = (index: number) => {
    if (
      window.confirm(
        `Delete team member "${teamMembers[index]}"? This will affect existing tasks and timers.`
      )
    ) {
      const teamToDelete = teamMembers[index]
      setTeamMembers(teamMembers.filter((_, i) => i !== index))
      setTasks(tasks.map((t) => (t.teamMember === teamToDelete ? { ...t, teamMember: '' } : t)))
      setTimers(timers.map((t) => (t.teamMember === teamToDelete ? { ...t, teamMember: '' } : t)))
    }
  }

  // Add new timer card
  const handleAddTimer = () => {
    if (appNames.length === 0) {
      alert('Please add an app first.')
      return
    }
    if (teamMembers.length === 0) {
      alert('Please add team member(s) first.')
      return
    }
    const newTimer: TimerInstance = {
      id: uuidv4(),
      selectedApp: appNames[appNames.length - 1],
      taskName: '',
      teamMember: teamMembers[0],
      secondsElapsed: 0,
      isRunning: false,
      isPaused: false,
      completed: false,
    }
    setTimers((prev) => [...prev, newTimer])
  }

  // TaskList handlers
  const handleTaskEditToggle = (taskId: string, isEditing: boolean) => {
    setTasks((tasks) => tasks.map((t) => (t.id === taskId ? { ...t, isEditing } : t)))
  }

  const handleTaskUpdateField = (taskId: string, field: keyof TaskEntry, value: string | number) => {
    setTasks((tasks) => tasks.map((t) => (t.id === taskId ? { ...t, [field]: value } : t)))
  }

  const handleTaskSave = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    if (!task.taskName.trim()) {
      alert('Task name cannot be empty')
      return
    }
    if (!appNames.includes(task.appName)) {
      alert('Task app must be a valid app')
      return
    }
    if (task.teamMember && !teamMembers.includes(task.teamMember)) {
      alert('Task team member must be valid')
      return
    }

    handleTaskEditToggle(taskId, false)
  }

  const handleTaskDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks((tasks) => tasks.filter((t) => t.id !== taskId))
    }
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>TaskTimer</h1>
        <button
          className={`manage-toggle-btn ${manageOpen ? 'open' : ''}`}
          onClick={() => setManageOpen(!manageOpen)}
          aria-expanded={manageOpen}
          aria-controls="manage-panel"
        >
          Manage
        </button>
      </header>

      {/* Manage Panel */}
      {manageOpen && (
        <section id="manage-panel" className="manage-panel" aria-label="Manage apps and team members">
          <ManageApps
            appNames={appNames}
            newAppName={newAppName}
            onNewAppNameChange={setNewAppName}
            onAddApp={handleAddApp}
            onEditApp={handleEditApp}
            onDeleteApp={handleDeleteApp}
          />
          <ManageTeamMembers
            teamMembers={teamMembers}
            newTeamMember={newTeamMember}
            onNewTeamMemberChange={setNewTeamMember}
            onAddTeamMember={handleAddTeamMember}
            onEditTeamMember={handleEditTeamMember}
            onDeleteTeamMember={handleDeleteTeamMember}
          />
        </section>
      )}

      {/* Controls */}
      <div className="top-controls">
        <button onClick={handleAddTimer} className="add-timer-btn" title="Add New Task Timer">
          Add New Task
        </button>
        <button className="clear-all-btn" onClick={handleClearAll}>
          Clear All
        </button>
      </div>

      {/* Timer Cards */}
      <div className="timers-list" aria-live="polite">
        {timers.map((timer) => (
          <TimerCard
            key={timer.id}
            timer={timer}
            appNames={appNames}
            teamMembers={teamMembers}
            updateTimer={updateTimer}
            handleStart={handleStart}
            handlePause={handlePause}
            handleResume={handleResume}
            handleStop={handleStop}
          />
        ))}
      </div>

      {/* Completed Tasks */}
      <TaskList
        tasks={tasks}
        appNames={appNames}
        teamMembers={teamMembers}
        onEditToggle={handleTaskEditToggle}
        onUpdateField={handleTaskUpdateField}
        onSave={handleTaskSave}
        onCancel={(taskId) => handleTaskEditToggle(taskId, false)}
        onDelete={handleTaskDelete}
      />
    </div>
  )
}

export default App
