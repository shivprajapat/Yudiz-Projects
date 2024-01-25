/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import Image from 'next/image'
import { useSelector } from 'react-redux'
import AccountManagements from './index'
import { iconAngleLeft } from '@/assets/images'
import PersonalInformation from '@/components/account/PersonalInformation'
import ChangePassword from '@/components/account/ChangePassword'
import META from '@/helper/meta-constant'
import { Meta } from '@/components/generic'
import EditProfile from '@/components/account/EditProfile'

const MyAccount = () => {
  const intl = useIntl()
  const accountdetails = useSelector(
    (state) => state.accountReducer.accountData.customer
  )

  function handleStepChange(id) {
    setStep(id)
  }

  const steps = {
    0: (
      <PersonalInformation
        accountdetails={accountdetails}
        handleStepChange={handleStepChange}
      />
    ),
    1: <ChangePassword />,
    2: <EditProfile handleStepChange={handleStepChange} />,
  }
  const [step, setStep] = useState(0)
  const Step = steps[step]

  const stepTitles = [
    intl.formatMessage({ id: 'page.myAccount.title.personalInformation' }),
    intl.formatMessage({ id: 'page.myAccount.title.changePassword' }),
    intl.formatMessage({ id: 'page.myAccount.title.editPersonalInformation' }),
  ]
  return (
    <>
      <Meta title={META.profile.title} description={META.profile.description} />
      <AccountManagements>
        <div className="capitalize border-b border-grey-400 pb-4 mb-6">
          <h5 className="text-grey-900 font-jost text-xl font-semibold">
            Account Settings
          </h5>
        </div>
        <div className="w-[380px] max-w-full">
          <h6 className="flex gap-2 font-jost text-grey-800 font-medium text-base pb-4">
            {step > 0 && (
              <button
                onClick={() => {
                  setStep(0)
                  // reset()
                }}
              >
                <Image src={iconAngleLeft} alt="" height="" width=""></Image>
              </button>
            )}
            {stepTitles[step]}
          </h6>
          {Step}
        </div>
      </AccountManagements>
    </>
  )
}

export default MyAccount
