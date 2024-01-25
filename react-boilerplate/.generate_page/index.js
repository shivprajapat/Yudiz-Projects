const fs = require('node:fs')

const { component, hook } = require('./page_templates.js')

function writeFileErrorHandler(err) {
  if (err) throw err
}

// grab component name from terminal argument
const [name] = process.argv.slice(2)
if (!name) throw new Error('You must include a component name.')

const dir = `./src/views/${name}`

// throw an error if the file already exists
if (fs.existsSync(dir)) throw new Error('A component with that name already exists.')

// create the folder
fs.mkdir(dir, { recursive: true }, (err) => {
  if (err) throw err
})

// components folder
fs.mkdir(`${dir}/components`, { recursive: true }, (err) => {
  if (err) throw err
})

// hooks folder
fs.mkdir(`${dir}/hooks`, { recursive: true }, (err) => {
  if (err) throw err
})

// useComponentName hook
fs.mkdir(`${dir}/hooks/use-${name}`, { recursive: true }, (err) => {
  if (err) throw err
  fs.writeFile(`${dir}/hooks/use-${name}/index.js`, hook(name), writeFileErrorHandler)
})

// index.jsx
fs.writeFile(`${dir}/index.jsx`, component(name), writeFileErrorHandler)

// style.scss
fs.writeFile(`${dir}/style.scss`, '', writeFileErrorHandler)
