import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { scrollToId } from 'shared/utils'
import { updateAdminGeneralSettings, getAdminGeneralSetting, createAdminGeneralSetting, getAdminCommissionSetting, createAdminCommissionSetting, updateAdminCommissionSetting } from 'admin/modules/adminSettings/redux/service'

const useAdminSettings = () => {
  const dispatch = useDispatch()

  const [selectedTab, setSelectedTab] = useState('generalSettings')
  const [loading, setLoading] = useState(false)
  const [defaultValues, setDefaultValues] = useState('')
  const [commissionValues, setcommissionValues] = useState('')
  const [generalSettingId, setGeneralSettingId] = useState(0)
  const [commissionSettingId, setCommissionSettingId] = useState(0)

  const resStatus = useSelector((state) => state.adminSettings.resStatus)
  const resMessage = useSelector((state) => state.adminSettings.resMessage)
  const singleAdminGeneralSettings = useSelector((state) => state.adminSettings.singleAdminGeneralSettings)
  const adminCommissionSettings = useSelector((state) => state.adminSettings.adminCommissionSettings)

  useEffect(() => {
    dispatch(getAdminGeneralSetting())
  }, [])

  useEffect(() => {
    if (selectedTab === 'commission') {
      dispatch(getAdminCommissionSetting())
    }
  }, [selectedTab])

  useEffect(() => {
    if (singleAdminGeneralSettings?.id) {
      setGeneralSettingId(singleAdminGeneralSettings.id)
    } else if (singleAdminGeneralSettings?.setting?.length > 0) {
      setGeneralSettingId(singleAdminGeneralSettings.setting[0]?.id)
      setDefaultValues(singleAdminGeneralSettings.setting[0])
    }
  }, [singleAdminGeneralSettings])

  useEffect(() => {
    if (adminCommissionSettings?.commission?.id) {
      setCommissionSettingId(adminCommissionSettings.commission?.id)
    } else if (adminCommissionSettings?.commission?.length > 0) {
      setCommissionSettingId(adminCommissionSettings.commission[0]?.id)
      const commissionValues = { decryptedBankDetails: adminCommissionSettings.commission[0].decryptBankDetail }
      setcommissionValues(commissionValues)
    }
    setLoading(false)
  }, [adminCommissionSettings])

  useEffect(() => {
    if (!resStatus && resMessage) {
      setLoading(false)
    }
  }, [resMessage, resStatus])

  const handleTabChange = (tab) => {
    setSelectedTab(tab)
    scrollToId('edit-settings-container')
  }

  const handleStepSubmit = (updateType, data) => {
    setLoading(true)
    let payload = data
    if (updateType === 'generalSettings') {
      payload = { ...payload }
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

    if (selectedTab === 'commission') {
      if (commissionSettingId === 0) {
        dispatch(createAdminCommissionSetting(payload))
      } else {
        dispatch(updateAdminCommissionSetting(commissionSettingId, payload))
      }
      return
    }

    if (singleAdminGeneralSettings?.setting?.length === 0 && updateType === 'generalSettings') {
      dispatch(createAdminGeneralSetting(payload))
      setLoading(false)
      return
    }

    dispatch(updateAdminGeneralSettings(generalSettingId, { updateType, ...payload }))
    setLoading(false)
  }
  return { selectedTab, handleTabChange, handleStepSubmit, defaultValues, commissionValues, loading }
}

export default useAdminSettings
