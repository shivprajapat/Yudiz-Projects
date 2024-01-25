import React, { lazy, Suspense, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import Loading from '../../../component/Loading'
import UserHeader from '../components/UserHeader'
const DepositPage = lazy(() => import('./Deposit'))

function Deposit (props) {
  const [activeTab, setActiveTab] = useState(true)

  return (
    <>
      <UserHeader
        {...props}
        activeTab={activeTab}
        backURL='/profile'
        setActiveTab={setActiveTab}
        title={<FormattedMessage id="Deposit" />}
      />
      <Suspense fallback={<Loading />}>
        <DepositPage
          {...props}
          activeTab={activeTab}
          payment
          setActiveTab={setActiveTab}
        />
      </Suspense>
    </>
  )
}

export default Deposit
