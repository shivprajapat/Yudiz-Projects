import { getRobotsTxt } from '@shared/utils'

export default function handler(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  })
  return res.end(getRobotsTxt())
}
