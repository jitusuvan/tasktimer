import React from 'react';
import type { TaskEntry } from '../../types';
import { formatTaskDuration } from '../common/formatters';

interface Props {
  task: TaskEntry;
  appNames: string[];
  teamMembers: string[];
  onEditToggle: (taskId: string, isEditing: boolean) => void;
  onUpdateField: (
    taskId: string,
    field: keyof TaskEntry,
    value: string | number
  ) => void;
  onSave: (taskId: string) => void;
  onCancel: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<Props> = ({
  task,
  appNames,
  teamMembers,
  onEditToggle,
  onUpdateField,
  onSave,
  onCancel,
  onDelete,
}) => {
  // Clicking on task toggles editing (if not already editing)
  const handleTaskClick = () => {
    if (!task.isEditing) {
      onEditToggle(task.id, true);
    }
  };

  if (task.isEditing) {
    return (
      <li className="task-entry" style={{ cursor: 'default' }}>
        <select
          value={task.appName}
          onChange={(e) => onUpdateField(task.id, 'appName', e.target.value)}
          aria-label="Edit app name"
        >
          {appNames.map((app) => (
            <option key={app} value={app}>
              {app}
            </option>
          ))}
        </select>{' '}
        <input
          type="text"
          value={task.taskName}
          onChange={(e) => onUpdateField(task.id, 'taskName', e.target.value)}
          aria-label="Edit task name"
        />{' '}
        <select
          value={task.teamMember}
          onChange={(e) => onUpdateField(task.id, 'teamMember', e.target.value)}
          aria-label="Edit team member"
        >
          <option value="">None</option>
          {teamMembers.map((tm) => (
            <option key={tm} value={tm}>
              {tm}
            </option>
          ))}
        </select>{' '}
        <input
          type="number"
          min={0}
          value={Math.floor(task.durationSeconds / 60)}
          onChange={(e) => {
            const mins = Math.max(0, Number(e.target.value) || 0);
            onUpdateField(task.id, 'durationSeconds', mins * 60);
          }}
          aria-label="Edit duration in minutes"
          style={{ width: 60 }}
        />{' '}
        min{' '}
        <button
          onClick={() => onSave(task.id)}
          disabled={!task.taskName.trim()}
          aria-label="Save task"
        >
          Save
        </button>{' '}
        <button onClick={() => onCancel(task.id)} aria-label="Cancel edit">
          Cancel
        </button>{' '}
        <button onClick={() => onDelete(task.id)} aria-label="Delete task">
          Delete
        </button>
      </li>
    );
  }

  return (
    <li
      className="task-entry"
      onClick={handleTaskClick}
      style={{ cursor: 'pointer', userSelect: 'none' }}
      tabIndex={0}
      onKeyDown={(e) => {
        // Enter or Space triggers edit mode on keyboard
        if (e.key === 'Enter' || e.key === ' ') {
          onEditToggle(task.id, true);
          e.preventDefault();
        }
      }}
      aria-label={`Task: ${task.taskName}, duration ${formatTaskDuration(
        task.durationSeconds
      )}${task.teamMember ? ', team member: ' + task.teamMember : ''}. Click to edit`}
      role="button"
    >
      {formatTaskDuration(task.durationSeconds)} - {task.taskName}{' '}
{/*       {task.teamMember ? <em>(Team: {task.teamMember})</em> : null} */}
    </li>
  );
};

export default TaskItem;
