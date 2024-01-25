import axios from 'axios'

export const baseURL = process.env.REACT_APP_API_URL
export const blockChainURL = process.env.REACT_APP_BLOCK_CHAIN_API_URL

export const axiosInstanceBlockChain = axios.create({
  blockChainURL
})

export const axiosInstance = axios.create({
  baseURL,
  responseType: 'json'
})

export default axios.create({
  baseURL,
  responseType: 'json'
})
