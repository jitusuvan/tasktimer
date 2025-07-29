import React from 'react'
import type { TimerInstance } from '../../types/index'
import { formatTime } from '../common/formatters'

interface Props {
  timer: TimerInstance
  appNames: string[]
  teamMembers: string[]
  updateTimer: (id: string, changes: Partial<TimerInstance>) => void
  handleStart: (id: string) => void
  handlePause: (id: string) => void
  handleResume: (id: string) => void
  handleStop: (id: string) => void
}

const TimerCard: React.FC<Props> = ({
  timer,
  appNames,
  teamMembers,
  updateTimer,
  handleStart,
  handlePause,
  handleResume,
  handleStop,
}) => {
  return (
    <div className="timer-card" role="region" aria-label={`Timer for ${timer.selectedApp}`}>
      <select
        value={timer.selectedApp}
        onChange={(e) => updateTimer(timer.id, { selectedApp: e.target.value })}
        disabled={timer.isRunning}
        aria-label="Select App"
      >
        {appNames.map((app) => (
          <option key={app} value={app}>
            {app}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Task name *required"
        value={timer.taskName}
        onChange={(e) => updateTimer(timer.id, { taskName: e.target.value })}
        disabled={timer.isRunning}
        aria-label="Task Name"
        required
      />
      <select
        value={timer.teamMember}
        onChange={(e) => updateTimer(timer.id, { teamMember: e.target.value })}
        disabled={timer.isRunning}
        aria-label="Team Member"
      >
        {teamMembers.map((tm) => (
          <option key={tm} value={tm}>
            {tm}
          </option>
        ))}
      </select>
      <div className="timer-buttons" role="group" aria-label="Timer controls">
        {!timer.isRunning && <button onClick={() => handleStart(timer.id)}>Start</button>}
        {timer.isRunning && !timer.isPaused && (
          <>
            <button onClick={() => handlePause(timer.id)}>Pause</button>
            <button onClick={() => handleStop(timer.id)}>Stop</button>
          </>
        )}
        {timer.isRunning && timer.isPaused && (
          <>
            <button onClick={() => handleResume(timer.id)}>Resume</button>
            <button onClick={() => handleStop(timer.id)}>Stop</button>
          </>
        )}
      </div>
      <div className="timer-display" aria-live="polite" aria-atomic="true">
        {formatTime(timer.secondsElapsed)}
      </div>
    </div>
  )
}

export default TimerCard
