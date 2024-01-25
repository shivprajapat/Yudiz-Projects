import { AR, EN, ES, RU } from './action'

export const lang = (state = { locale: 'en' }, action = {}) => {
  switch (action.type) {
    case EN:
      return {
        ...state,
        locale: 'en'
      }
    case ES:
      return {
        ...state,
        locale: 'es'
      }
    case RU:
      return {
        ...state,
        locale: 'ru'
      }

    case AR:
      return {
        ...state,
        locale: 'ar'
      }
    default:
      return state
  }
}
