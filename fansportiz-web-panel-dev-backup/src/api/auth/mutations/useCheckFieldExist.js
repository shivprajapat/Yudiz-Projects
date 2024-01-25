import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { FormattedMessage } from 'react-intl'
import axios from '../../../axios/instanceAxios'

export const CheckExist = async ({ sType, sValue }) => {
  return await axios.post('/gaming/user/auth/check-exist/v1', { sType, sValue })
}

export default function useCheckExist ({ setErrUserName, setErrEmail, setErrNumber }) {
  const mutationData = useMutation({
    mutationFn: CheckExist,
    onError: (error) => {
      const valueType = JSON.parse(error?.response?.config?.data)
      if (valueType.sType === 'U') setErrUserName(<FormattedMessage id="Username_already_exist" />)
      if (valueType.sType === 'E') setErrEmail(<FormattedMessage id="Email_already_exist" />)
      if (valueType.sType === 'M') setErrNumber(<FormattedMessage id="Mobile_no_already_exist" />)
    }
  })
  return { ...mutationData }
}
