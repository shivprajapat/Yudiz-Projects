import * as yup from 'yup'

export const changePassword = () =>
  yup.object().shape({
    currentPassword: yup.string().required('Current Password is required'),
    newPassword: yup
      .string()
      .required('New Password is required')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Minimum 8 characters, at least one letter, one number & one special character'
      ),
    confirmNewPassword: yup.string().required('Confirm New Password is required'),
  })
