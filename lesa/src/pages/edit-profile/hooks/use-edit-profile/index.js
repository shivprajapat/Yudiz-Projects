import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { profileUpdate } from 'modules/user/redux/service'
import { scrollToId } from 'shared/utils'
import { allRoutes } from 'shared/constants/allRoutes'

const useEditProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')

  const [selectedTab, setSelectedTab] = useState('basicInformation')
  const [formData, setFormData] = useState()
  const [userData, setUserData] = useState()
  const [loading, setLoading] = useState(false)

  const currentUser = useSelector((state) => state.user.user)
  const resStatus = useSelector((state) => state.user.resStatus)
  const resMessage = useSelector((state) => state.user.resMessage)

  useEffect(() => {
    currentUser && setUserData(currentUser)
  }, [currentUser])

  useEffect(() => {
    if (!resStatus && resMessage) {
      setLoading(false)
    }
  }, [resMessage, resStatus])

  const handleTabChange = (tab) => {
    setSelectedTab(tab)
    scrollToId('edit-profile-container')
  }

  const handleStepSubmit = (step, data) => {
    if (step === 1) {
      setFormData({ ...formData, ...data })
      handleTabChange('links')
    } else if (step === 2) {
      const payload = { ...formData, ...data }
      setLoading(true)
      dispatch(
        profileUpdate(userId, payload, () => {
          navigate(allRoutes.profileCollected)
        })
      )
    }
  }
  return { selectedTab, handleTabChange, handleStepSubmit, defaultValues: userData, loading }
}

export default useEditProfile
