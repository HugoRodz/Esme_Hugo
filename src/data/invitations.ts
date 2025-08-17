export type Invite = {
  name: string
  passes: number
}

export function getInvitations(): Record<number, Invite> {
  const map: Record<number, Invite> = {}
  for (let i = 1; i <= 120; i++) {
    map[i] = { name: `Invitado ${i}`, passes: i % 3 === 0 ? 2 : 1 }
  }
  // Example real entry
  map[5] = { name: 'Juan Pérez', passes: 2 }
  return map
}
