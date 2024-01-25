import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Loader from 'Components/Loader'
import Router from 'Routes/Router'
import { route } from 'Constants/AllRoutes'

function AllRoutes() {
  function allPaths(children) {
    return children?.map(({ path, Component, exact, props, children: child }, index) => {
      return child?.length ? (
        <Route element={<Component />} key={index}>
          {allPaths(child)}
        </Route>
      ) : (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={<Loader />}>
              <Component {...props} />
            </Suspense>
          }
          exact={exact}
        />
      )
    })
  }
  return (
    <Routes>
      <Route path='/' element={<Navigate replace to={route.audit} />} />
      {Router?.map(({ isPrivateRoute, children, Component }) => {
        return (
          <Route key={isPrivateRoute ? 'private' : 'public'} element={<Component />}>
            {allPaths(children)}
          </Route>
        )
      })}
      {/* <Route path='*' element={<Navigate to='/login' />} /> */}
    </Routes>
  )
}

export default AllRoutes
