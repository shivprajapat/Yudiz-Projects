// require all modules on the path and with the pattern defined
// const req = require.context('./', true, /\.js$/)
const req = require.context('./', true, /^.\/.*js$/)

const modules = req.keys().map(req)
// console.log({modules, req}, 'req.keys()', req.keys())
// export all modules
module.exports = modules
