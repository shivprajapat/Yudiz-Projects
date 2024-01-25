// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// eslint-disable-next-line no-unused-vars
// const heapdump = require('heapdump')

export default function handler(req, res) {
  // heapdump.writeSnapshot(function(err, filename) {
  //   console.log('dump written to', filename)
  // })
  res.status(200).json({ name: 'pleasure to meet you' })
}
