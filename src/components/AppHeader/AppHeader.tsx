import React from 'react'

interface Props {
  manageOpen: boolean
  toggleManage: () => void
}

const AppHeader: React.FC<Props> = ({ manageOpen, toggleManage }) => {
  return (
    <header className="app-header">
      <h1>TaskTimer</h1>
      <button
        className={`manage-toggle-btn ${manageOpen ? 'open' : ''}`}
        onClick={toggleManage}
        aria-expanded={manageOpen}
        aria-controls="manage-panel"
      >
        Manage
      </button>
    </header>
  )
}

export default AppHeader
