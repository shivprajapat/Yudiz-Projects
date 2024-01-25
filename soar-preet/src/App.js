import 'App.css'
import { Suspense, lazy } from 'react'
import { Provider } from 'react-redux'
import Loader from 'Components/Loader'
import store from 'Redux/Store/Store'

const AllRoutes = lazy(() => import('Routes/index'))

function App() {
  return (
    <>
      <Provider store={store}>
        <Suspense fallback={<Loader />}>
          <AllRoutes />
        </Suspense>
      </Provider>
    </>
  )
}

export default App;
