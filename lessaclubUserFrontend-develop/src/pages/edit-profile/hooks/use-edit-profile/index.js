import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { profileUpdate, getUserBankAccountDetails } from 'modules/user/redux/service'
import { scrollToId } from 'shared/utils'
import { GlobalEventsContext } from 'shared/components/global-events'

const useEditProfile = () => {
  const dispatch = useDispatch()
  const userId = localStorage.getItem('userId')
  const { dispatch: editProfileEvent } = useContext(GlobalEventsContext)

  const [selectedTab, setSelectedTab] = useState('basicInformation')
  const [userData, setUserData] = useState()
  const [loading, setLoading] = useState(false)

  const resStatus = useSelector((state) => state.user.resStatus)
  const resMessage = useSelector((state) => state.user.resMessage)
  const bankAccountInfoError = useSelector((state) => state.user.bankAccountInfoError)
  const userBankAccountDetails = useSelector((state) => state.user.userBankAccountDetails)

  useEffect(() => {
    if (userBankAccountDetails?.users) {
      setUserData(userBankAccountDetails?.users)
    }
  }, [userBankAccountDetails])

  useEffect(() => {
    if ((!resStatus && resMessage) || bankAccountInfoError) {
      setLoading(false)
    }
  }, [resMessage, resStatus, bankAccountInfoError])

  useEffect(() => {
    userId && dispatch(getUserBankAccountDetails(userId))
  }, [])

  const handleTabChange = (tab) => {
    setSelectedTab(tab)
    scrollToId('edit-profile-container')
  }

  const handleStepSubmit = (updateType, data) => {
    setLoading(true)
    let payload = data
    if (updateType === 'basicInfo') {
      payload = { ...payload, timezone: payload.timezone.value }
      delete payload.kycStatus
    }
    if (updateType === 'bankAccountInfo') {
      payload = {
        accountNumber: data.decryptedBankDetails.accountNumber,
        routingNumber: data.decryptedBankDetails.routingNumber,
        isIban: data.decryptedBankDetails.isIban === 'withIban',
        iban: data.decryptedBankDetails.iban,
        billingDetails: { ...data.decryptedBankDetails.billingDetails, country: data.decryptedBankDetails.billingDetails.country.label },
        bankAddress: { ...data.decryptedBankDetails.bankAddress, country: data.decryptedBankDetails.bankAddress.country.label }
      }
    }
    dispatch(
      profileUpdate(userId, { updateType, ...payload }, (data) => {
        setLoading(false)
        editProfileEvent({
          type: 'CHANGE_PROFILE',
          payload: { profileData: data?.users }
        })
      })
    )
  }
  return { selectedTab, handleTabChange, handleStepSubmit, defaultValues: userData, loading }
}

export default useEditProfile
