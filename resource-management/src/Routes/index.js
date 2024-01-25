import React, { Suspense, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'

import RoutesDetails from './Routes'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import Loading from 'Components/Loading'
import { useQuery, useQueryClient } from 'react-query'
import { Toast, ToastContainer } from 'react-bootstrap'
import ToastIcon from 'Assets/Icons/ToastIcon'
import Cancel from 'Assets/Icons/Cancel'

function AllRoutes() {
  const [message, setMessage] = useState('')
  const [toastOpen, setToastOpen] = useState(false)
  // eslint-disable-next-line
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
        }, 5000)
      },
    }
  )

  // function toastStyle(){
  //   if()
  // }

  return (
    <>
      <ToastContainer style={{ zIndex: 1400 }} position="top-end" className="p-3 zindex-fixed">
        <Toast show={toastOpen} onClose={() => setToastOpen(false)} className="">
          <Toast.Body className="d-flex justify-content-between align-items-center ">
            <div className="d-flex align-items-center">
              <ToastIcon fill="#ff5658" className="me-2" />
              {message}
            </div>
            <div onClick={() => setToastOpen(false)}>
              <Cancel fill="#ff5658" />
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <BrowserRouter>
        <Routes>
          {RoutesDetails?.map(({ isPrivateRoute, children }) => {
            if (isPrivateRoute) {
              return (
                <Route key="private" element={<PrivateRoute />}>
                  {children.map(({ path, Component, exact, props }) => {
                    return (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <Suspense fallback={<Loading />}>
                            <Component {...props} />
                            <Outlet />
                          </Suspense>
                        }
                        exact={exact}
                      />
                    )
                  })}
                </Route>
              )
            } else {
              return (
                <Route key="public" element={<PublicRoute />}>
                  {children.map(({ path, Component, exact, props }) => {
                    return (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <Suspense fallback={<Loading />}>
                            <Component {...props} />
                            <Outlet />
                          </Suspense>
                        }
                        exact={exact}
                      />
                    )
                  })}
                </Route>
              )
            }
          })}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default AllRoutes
