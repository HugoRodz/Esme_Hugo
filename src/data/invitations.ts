export type Invite = {
  name: string
  passes: number
  // 3-digit verification code used to confirm the invitee
  code: string
  // assigned table number for seating (1-based)
  table: number
}

export function getInvitations(): Record<number, Invite> {
  const map: Record<number, Invite> = {}
  for (let i = 1; i <= 120; i++) {
    // default verification: zero-padded index (e.g. 005)
    // default table distribution: 10 invitados por mesa
    map[i] = { name: `Invitado ${i}`, passes: i % 3 === 0 ? 2 : 1, code: String(i).padStart(3, '0'), table: Math.ceil(i / 10) }
  }
  // Example real entry (override verification code and table for the example)
  map[5] = { name: 'Juan Pérez', passes: 2, code: '001', table: 10 }
  return map
}
