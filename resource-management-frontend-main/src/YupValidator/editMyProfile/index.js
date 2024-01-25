import * as yup from 'yup'

export const editMyProfile = () =>
  yup.object().shape({
    employeeName: yup.string().required('Employee Name is required'),
    employeeEmailId: yup.string().email('must be email').required('Email ID is required'),
    employeeContactNumber: yup.string().required('Mobile Number is required'),
    employeeJobProfile: yup.object().shape({
      sName: yup.string().required('Job Profile is required'),
      _id: yup.string().required('Job Profile is required'),
    }),
    employeeDepartment: yup
      .object()
      .shape({
        sName: yup.string().required('Department is required'),
        _id: yup.string().required('Department is required'),
      })
      .nullable(),
  })
