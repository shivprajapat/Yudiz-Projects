import axios from '../axios/instanceAxios'

export const changeLanguage = ({ language = 'en-US' }) => {
  localStorage.setItem('language', language)
  return language
}

export const onGetLiveStreamList = async (start, limit, type) => {
  return await axios.get(`/gaming/user/match/stream-list/${type}/v1?start=${start}&limit=${limit}`)
}
