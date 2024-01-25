import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import GlobalEventsContext from '@shared/components/global-events/GlobalEventsContext'
import ToastrContext from '@shared/components/toastr/ToastrContext'
import useApp from '@shared/hooks/useApp'

const ErrorBoundary = dynamic(() => import('@shared/components/errorBoundary'))
const MyApolloProvider = dynamic(() => import('@graphql/index'))
const DownloadApp = dynamic(() => import('@shared/components/downloadApp'), { ssr: false })
const MainHeader = dynamic(() => import('@shared/components/header'))
const Footer = dynamic(() => import('@shared/components/footer'))
const Toastr = dynamic(() => import('@shared/components/toastr/Toastr'))

function AppContent({ children }) {
  const {
    isAmp,
    isPreview,
    stateGlobalEvents,
    dispatchGlobalEvents,
    state,
    dispatch,
    isGlanceView,
    router
  } = useApp()

  return (
    <ErrorBoundary>
      <GlobalEventsContext.Provider value={{ stateGlobalEvents, dispatchGlobalEvents }} >
        <ToastrContext.Provider value={{ state, dispatch }} >
          <MyApolloProvider dispatch={dispatch} router={router}>
            {!isAmp && !isPreview && !isGlanceView && <DownloadApp />}
            {!isAmp && !isPreview && <MainHeader />}
            {children}
            {(!isAmp && !isPreview && !isGlanceView) && <Footer />}
          </MyApolloProvider>
          {state?.message && <Toastr type={state?.type} msg={state?.message} btnTxt={state?.btnTxt} />}
        </ToastrContext.Provider>
      </GlobalEventsContext.Provider>
    </ErrorBoundary>
  )
}
AppContent.propTypes = {
  children: PropTypes.node.isRequired
}
export default React.memo(AppContent)
