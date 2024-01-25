import { useCallback, useReducer } from 'react'

const API_STATES = {
  is_loading: 'isLoading',
  is_success: 'isSuccessful',
  is_failed: 'isFailure',
}

const initialState = {
  isLoading: false,
  isSuccess: false,
  isFailed: false,
  data: {},
  error: {},
}

const reducer = (state, action) => {
  switch (action.type) {
    case API_STATES.is_loading:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isFailed: false,
      }
    case API_STATES.is_success:
      return {
        ...state,
        data: action.data,
        isLoading: false,
        isSuccess: true,
        isFailed: false,
        error: '',
      }
    case API_STATES.is_failed:
      return {
        ...state,
        data: null,
        isLoading: false,
        isSuccess: false,
        isFailed: true,
        error: action.error,
      }
    case 'SET_DATA':
      return {
        ...state,
        data: action.data,
      }
    case 'RESET_DATA':
      return initialState
    default:
      return state
  }
}
const useAsync = (successCallback = null, errorCallback = null) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const run = (method, ...config) => {
    dispatch({ type: API_STATES.is_loading })

    method(...config)
      .then((res) => {
        if (successCallback) {
          successCallback(res)
        }
        if (res?.data) {
          dispatch({ type: API_STATES.is_success, data: res.data })
        } else {
          dispatch({ type: API_STATES.is_success, data: res })
        }
      })
      .catch((err) => {
        if (errorCallback) {
          errorCallback(err)
        }
        dispatch({ type: API_STATES.is_failed, error: err })
      })
  }

  const setData = useCallback(
    (data) => dispatch({ type: 'SET_DATA', data }),
    [dispatch]
  )
  const setLoading = useCallback(
    (payload) => dispatch({ type: API_STATES.is_loading, payload }),
    [dispatch]
  )
  const resetData = useCallback(
    () => dispatch({ type: 'RESET_DATA' }),
    [dispatch]
  )

  return {
    run,
    state,
    setData,
    setLoading,
    resetData,
  }
}

export default useAsync
