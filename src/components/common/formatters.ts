export const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export const formatTaskDuration = (seconds: number) => {
  if (seconds < 3600) {
    return `${Math.round(seconds / 60)}min`
  }
  const hrs = seconds / 3600
  const intHrs = Math.floor(hrs)
  const mins = Math.round((seconds % 3600) / 60)
  if (mins === 0) return `${intHrs}hr`
  if (mins >= 30) return `${intHrs + 0.5}hr`
  return `${intHrs}hr`
}
