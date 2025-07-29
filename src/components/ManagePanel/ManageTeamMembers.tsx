import React from 'react'

interface Props {
  teamMembers: string[]
  newTeamMember: string
  onNewTeamMemberChange: (val: string) => void
  onAddTeamMember: () => void
  onEditTeamMember: (index: number, val: string) => void
  onDeleteTeamMember: (index: number) => void
}

const ManageTeamMembers: React.FC<Props> = ({
  teamMembers,
  newTeamMember,
  onNewTeamMemberChange,
  onAddTeamMember,
  onEditTeamMember,
  onDeleteTeamMember,
}) => {
  return (
    <div className="manage-group">
      <h2>Manage Team Members</h2>
      <div className="manage-list">
        {teamMembers.map((tm, idx) => (
          <div key={idx} className="manage-item">
            <input
              type="text"
              value={tm}
              onChange={(e) => onEditTeamMember(idx, e.target.value)}
              aria-label={`Edit team member ${tm}`}
            />
            <button onClick={() => onDeleteTeamMember(idx)} aria-label={`Delete team member ${tm}`}>
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className="manage-add">
        <input
          type="text"
          value={newTeamMember}
          onChange={(e) => onNewTeamMemberChange(e.target.value)}
          placeholder="New team member"
          aria-label="New Team Member"
        />
        <button onClick={onAddTeamMember} aria-label="Add new team member">
          Add Member
        </button>
      </div>
    </div>
  )
}

export default ManageTeamMembers
