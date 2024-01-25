import React, { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'

const Router = React.lazy(() => import('routes/index'))
const ThemeConfig = React.lazy(() => import('theme/index'))

function App() {
  console.log('v1.3')
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <ThemeConfig>
          <Router />
        </ThemeConfig>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
