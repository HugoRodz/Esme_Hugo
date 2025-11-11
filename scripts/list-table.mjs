import fs from 'node:fs'
import path from 'node:path'

const file = path.resolve('/Users/Gsrod/Documents/BODA J&E/boda-jorge-esmeralda/src/data/access.ts')
const src = fs.readFileSync(file, 'utf8')

function parseAccessBase(text) {
  const out = []
  const baseBlockMatch = text.match(/export\s+const\s+ACCESS_BASE:[\s\S]*?=\s*\[([\s\S]*?)]\s*;/)
  if (!baseBlockMatch) return out
  const block = baseBlockMatch[1]
  const re = /\{\s*name:\s*['"]([^'"\\]+)['"],\s*passes:\s*(\d+),\s*table:\s*(\d+),\s*code:\s*['"]([^'"\\]+)['"]\s*}/g
  let m
  while ((m = re.exec(block))) {
    out.push({ name: m[1], passes: Number(m[2]), table: Number(m[3]), code: m[4] })
  }
  return out
}

// Try block-based parse; if empty, fall back to scanning all object literals
let base = parseAccessBase(src)
if (!base.length) {
  const reAny = /\{\s*name:\s*['"]([^'"\\]+)['"],\s*passes:\s*(\d+),\s*table:\s*(\d+),\s*code:\s*['"]([^'"\\]+)['"]\s*}/g
  let m
  base = []
  while ((m = reAny.exec(src))) {
    base.push({ name: m[1], passes: Number(m[2]), table: Number(m[3]), code: m[4] })
  }
}
const table = Number(process.argv[2] || 10)
const rows = base.filter(r => r.table === table).sort((a,b)=>a.name.localeCompare(b.name))
console.log(JSON.stringify(rows, null, 2))
