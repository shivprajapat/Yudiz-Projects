// import { NETWORKS } from './constants'
const networkUrl = (network) => ({
  Ethereum: 'https://goerli.infura.io/v3/',
  Polygon: ''
}[network])

export {
  networkUrl
}

// REACT_APP_WEB3_PROVIDER=https://rinkeby.infura.io/v3/564f74127c3841d2b64507db55fd7595
// # REACT_APP_WEB3_PROVIDER=https://goerli.infura.io/v3/564f74127c3841d2b64507db55fd7595
