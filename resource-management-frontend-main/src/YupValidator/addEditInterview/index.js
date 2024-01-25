import * as yup from 'yup'

export const interviewValidator = () =>
  yup.object().shape({
    employeeName: yup.object().shape({
      sName: yup.string().required('Technology is required'),
      _id: yup.string().required('Technology is required'),
    }),
    clientName: yup.object().shape({
      sName: yup.string().required('Client is required'),
      _id: yup.string().required('Client is required'),
    }),

    project: yup.object().shape({
      sName: yup.string().required('Project is required'),
      _id: yup.string().required('Project is required'),
    }),
    interviewStatus: yup.object().shape({
      sName: yup.string().required('Status is required'),
      _id: yup.string().required('Status is required'),
    }),
  })
