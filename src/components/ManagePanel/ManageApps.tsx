import React from 'react'

interface Props {
  appNames: string[]
  newAppName: string
  onNewAppNameChange: (val: string) => void
  onAddApp: () => void
  onEditApp: (index: number, val: string) => void
  onDeleteApp: (index: number) => void
}

const ManageApps: React.FC<Props> = ({ appNames, newAppName, onNewAppNameChange, onAddApp, onEditApp, onDeleteApp }) => (
  <div className="manage-group">
    <h2>Manage App Names</h2>
    <div className="manage-list">
      {appNames.map((app, idx) => (
        <div key={idx} className="manage-item">
          <input
            type="text"
            value={app}
            onChange={(e) => onEditApp(idx, e.target.value)}
            aria-label={`Edit app name ${app}`}
          />
          <button onClick={() => onDeleteApp(idx)} aria-label={`Delete app name ${app}`}>
            Delete
          </button>
        </div>
      ))}
    </div>
    <div className="manage-add">
      <input
        type="text"
        value={newAppName}
        onChange={(e) => onNewAppNameChange(e.target.value)}
        placeholder="New app name"
        aria-label="New App Name"
      />
      <button onClick={onAddApp} aria-label="Add new app">
        Add App
      </button>
    </div>
  </div>
)

export default ManageApps
