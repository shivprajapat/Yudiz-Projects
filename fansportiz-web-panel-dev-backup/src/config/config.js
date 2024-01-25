import prod from './prod.js'
import stag from './stag.js'
import dev from './dev.js'

let environment
if (process.env.REACT_APP_ENVIRONMENT === 'production') {
  environment = prod
} else if (process.env.REACT_APP_ENVIRONMENT === 'staging') {
  environment = stag
} else {
  environment = dev
}

export default environment
