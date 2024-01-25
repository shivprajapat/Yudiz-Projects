const { formatName } = require('./helper')

exports.component = (name) => `import React from 'react'

import './style.scss'

const ${formatName(name)} = () => {
  return <div>Hello 👋, I am a ${formatName(name)} component.</div>
}
export default ${formatName(name)}
`

exports.hook = (name) => `const use${formatName(name)} = () => {
  return {}
}
export default use${formatName(name)}
`
