/* eslint-disable no-undef */
import React from 'react'
import AllRoutes from './Routes'
import './Assets/Style/style.scss'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      onSettled: (_d, e) => {
        if (e?.message === 'Network Error') {
          queryClient.invalidateQueries('toast')
          queryClient.setQueryData('message', () => ({ message: e?.message }))
        }
        if (e?.response?.status > 300) {
          queryClient.invalidateQueries('toast')
          queryClient.setQueryData('message', () => ({ message: e?.response?.data.message || e?.response?.data || e?.message }))
        }
      },
    },
    mutations: {
      onSettled: (_d, e) => {
        if (e?.message === 'Network Error') {
          queryClient.invalidateQueries('toast')
          queryClient.setQueryData('message', () => ({ message: e?.message }))
        }
        if (e?.response?.status > 300) {
          queryClient.invalidateQueries('toast')
          queryClient.setQueryData('message', () => ({ message: e?.response?.data.message || e?.response?.data || e?.message }))
        }
      },
    },
    message: (msg, type) => {
      queryClient.invalidateQueries('toast')
      queryClient.setQueryData('message', () => ({ message: msg, type }))
    },
  },
})

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'development') {
  console.log = () => {}
  console.error = () => {}
}

function App() {
  return (
    <QueryClientProvider contextSharing={true} client={queryClient}>
      {console.log(queryClient)}
      <AllRoutes />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
