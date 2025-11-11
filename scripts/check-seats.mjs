// Quick checker for seats per table based on src/data/access.ts
// Parses ACCESS_BASE and EXCEPTIONS, expands passes, and prints totals per table
import fs from 'node:fs'
import path from 'node:path'

const file = path.resolve('/Users/Gsrod/Documents/BODA J&E/boda-jorge-esmeralda/src/data/access.ts')
const src = fs.readFileSync(file, 'utf8')

function parseExceptions(text) {
  const out = new Map()
  const excBlockMatch = text.match(/export\s+const\s+EXCEPTIONS:[\s\S]*?=\s*{([\s\S]*?)}\s*;?/)
  if (!excBlockMatch) return out
  const block = excBlockMatch[1]
  const re = /['"]([^'"\\]+)['"]\s*:\s*\[\s*([^\]]*?)\s*]/g
  let m
  while ((m = re.exec(block))) {
    const name = m[1]
    const arr = (m[2] || '')
      .split(',')
      .map((s) => Number(String(s).trim()))
      .filter((n) => Number.isFinite(n))
    out.set(name, arr)
  }
  return out
}

function parseAccessBase(text) {
  const out = []
  const baseBlockMatch = text.match(/export\s+const\s+ACCESS_BASE:[\s\S]*?=\s*\[([\s\S]*?)]\s*;?/)
  if (!baseBlockMatch) return out
  const block = baseBlockMatch[1]
  // Match objects like: { name: 'X', passes: 2, table: 3, code: '123' }
  const re = /\{\s*name:\s*['"]([^'"\\]+)['"],\s*passes:\s*(\d+),\s*table:\s*(\d+),\s*code:\s*['"]([^'"\\]+)['"]\s*}/g
  let m
  while ((m = re.exec(block))) {
    out.push({ name: m[1], passes: Number(m[2]), table: Number(m[3]), code: m[4] })
  }
  return out
}

const exceptions = parseExceptions(src)
let base = parseAccessBase(src)
if (!base.length) {
  const reAny = /\{\s*name:\s*['"]([^'"\\]+)['"],\s*passes:\s*(\d+),\s*table:\s*(\d+),\s*code:\s*['"]([^'"\\]+)['"]\s*}/g
  let m
  base = []
  while ((m = reAny.exec(src))) {
    base.push({ name: m[1], passes: Number(m[2]), table: Number(m[3]), code: m[4] })
  }
}

// Expand access
const perTable = new Map()
for (const b of base) {
  const exc = exceptions.get(b.name)
  if (exc && exc.length > 0) {
    for (const mesa of exc) {
      perTable.set(mesa, (perTable.get(mesa) || 0) + 1)
    }
  } else {
    perTable.set(b.table, (perTable.get(b.table) || 0) + b.passes)
  }
}

// Prepare report for tables 1..12
const maxTable = Math.max(12, ...Array.from(perTable.keys()))
let ok = true
const lines = []
for (let t = 1; t <= maxTable; t++) {
  const count = perTable.get(t) || 0
  const status = count === 10 ? 'OK' : (count < 10 ? 'LOW' : 'HIGH')
  if (status !== 'OK') ok = false
  lines.push(`Mesa ${String(t).padStart(2,'0')}: ${String(count).padStart(2,' ')} ${status}`)
}

console.log(lines.join('\n'))
if (!ok) {
  console.log('\nMesas fuera de 10 lugares detectadas arriba.')
  process.exitCode = 1
} else {
  console.log('\nTodas las mesas están en 10 lugares.')
}
