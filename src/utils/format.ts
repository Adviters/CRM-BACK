export function fullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim()
}

export function initials(firstName: string, lastName?: string): string {
  const first = firstName.trim().charAt(0)
  const last = lastName?.trim().charAt(0) ?? ''
  return `${first}${last}`.toUpperCase() || '?'
}

export function downloadableFileName(base: string): string {
  return base.toLowerCase().replace(/\s+/g, '-')
}
