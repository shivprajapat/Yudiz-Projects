import Cancel from 'assets/images/Cancel'
import ToastIcon from 'assets/images/ToastIcon'
import React, { Suspense, useState } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import { useQuery, useQueryClient } from 'react-query'
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'

import Router from 'routes/Router'
import Loading from 'shared/components/loading'

function AllRoutes() {
  const [message, setMessage] = useState('')
  const [toastOpen, setToastOpen] = useState(false)

  const [toastType, setToastType] = useState('')
  const queryClient = useQueryClient()
  useQuery(
    'toast',
    () => {
      setMessage('')
      setToastOpen(false)
    },
    {
      onSuccess: () => {
        setMessage(queryClient.getQueryData('message')?.message || '')
        setToastType(queryClient.getQueryData('message')?.type || 'success-toast')
        setToastOpen(queryClient.getQueryData('message')?.message ? true : false)
        setTimeout(() => {
          setToastOpen(false)
        }, 3000)
      }
    }
  )

  function toastStyle() {
    const types = {
      success: '#f2f2f2',
      error: '#ff5658',
      warning: '#ffff00'
    }
    return types[toastType]
  }

  function allPaths(children) {
    return children?.map(({ path, Component, exact, props, children: child }) => {
      return child?.length ? (
        <Route element={<Component />}>{allPaths(child)}</Route>
      ) : (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={<Loading />}>
              <Component {...props} />
            </Suspense>
          }
          exact={exact}
        />
      )
    })
  }
  return (
    <>
      <ToastContainer position='top-end' className='p-3'>
        <Toast show={toastOpen} onClose={() => setToastOpen(false)} className=''>
          <Toast.Body>
            <div>
              <ToastIcon fill={toastStyle()} />
              {message}
            </div>
            <div onClick={() => setToastOpen(false)}>
              <Cancel fill='#ff5658' />
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <BrowserRouter>
        <Routes>
          {Router?.map(({ isPrivateRoute, children, Component }) => {
            return (
              <Route key={isPrivateRoute ? 'private' : 'public'} element={<Component />}>
                {allPaths(children)}
              </Route>
            )
          })}
          <Route path='*' element={<Navigate to='/dashboard' />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default React.memo(AllRoutes)
