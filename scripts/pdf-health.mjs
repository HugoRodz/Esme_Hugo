#!/usr/bin/env node
import http from 'http'

const port = process.env.PORT || 4411

const server = http.createServer((req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/api/health') {
      const payload = { ok: true, ts: Date.now(), pid: process.pid }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(payload))
      return
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('error')
  }
})

server.listen(port, () => console.log(`Health server listening on ${port}`))
