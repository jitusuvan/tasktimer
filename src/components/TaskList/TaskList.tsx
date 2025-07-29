import React from 'react'
import type { TaskEntry } from '../../types'
import TaskItem from './TaskItem'

interface Props {
  tasks: TaskEntry[]
  appNames: string[]
  teamMembers: string[]
  onEditToggle: (taskId: string, isEditing: boolean) => void
  onUpdateField: (taskId: string, field: keyof TaskEntry, value: string | number) => void
  onSave: (taskId: string) => void
  onCancel: (taskId: string) => void
  onDelete: (taskId: string) => void
}

const TaskList: React.FC<Props> = ({
  tasks,
  appNames,
  teamMembers,
  onEditToggle,
  onUpdateField,
  onSave,
  onCancel: _onCancel,
  onDelete,
}) => {
  // Group tasks by appName
  const groupedTasks = tasks.reduce<Record<string, TaskEntry[]>>((acc, task) => {
    if (!acc[task.appName]) acc[task.appName] = []
    acc[task.appName].push(task)
    return acc
  }, {})

  if (tasks.length === 0) return <p>No completed tasks yet.</p>

  return (
    <div className="task-list-wrap">
      {/* <h2>Completed Tasks</h2> */}
      {Object.entries(groupedTasks).map(([appName, appTasks]) => (
        <div key={appName} className="app-section" aria-label={`Tasks for app ${appName}`}>
          <div className="app-title">{appName}</div>
          <ul className="task-list">
            {appTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                appNames={appNames}
                teamMembers={teamMembers}
                onEditToggle={onEditToggle}
                onUpdateField={onUpdateField}
                onSave={onSave}
                onCancel={(taskId) => onEditToggle(taskId, false)} // cancel sets isEditing false (toggle false)
                onDelete={onDelete}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default TaskList
