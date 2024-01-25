import moment from 'moment'
import * as yup from 'yup'
import { ref } from 'yup'

export const validationSchemaMainCat = yup.object().shape({
  title: yup.string().required('Main Category is required'),
  sortOrder: yup.string().required('Sort Order is required')
})

export const validationSchemaQualification = yup.object().shape({
  title: yup
    .string()
    .required('Qualification is required')
    .min(2, 'Qualification must be at least 2 characters')
    .max(20, 'Qualification must be at most 20 characters')
    .matches(/^[a-zA-z]+([\s][a-zA-Z]+)*$/, 'Special Charaters & Numbers are not Allowed')
})

export const validationSchemaSchool = yup.object().shape({
  schoolName: yup
    .string()
    .required('School name is required')
    .min(2, 'School name must be at least 2 characters')
    .max(25, 'School name must be at most 25 characters')
    .matches(/^[a-zA-z]+([\s][a-zA-Z]+)*$/, 'Special Characters are not allowed'),
  country: yup.object().nullable().required('Country is required'),
  state: yup.object().nullable().required('State is required'),
  district: yup.object().nullable().required('District is required'),
  board: yup.object().nullable().required('Board is required'),
  address1: yup.string().required('Address-1 is required').min(2, 'Address-1  must be at least 2 characters')
    .max(30, 'Address-1  must be at most 30 characters'),
  address2: yup.string().required('Address-2 is required').min(2, 'Address-2  must be at least 2 characters')
    .max(30, 'Address-2  must be at most 30 characters'),
  pincode: yup
    .string()
    .required('Pincode is required')
    .matches(/^[\w]*$/, 'Negative numbers not allowed')
    .min(5, 'Pincode must be greater than & equals to 5 digits')
    .max(10, 'Pincode must be less than & equals to 10 digits')
})

export const validationSchemaSoftMat = yup.object().shape({
  tAbOne: yup
    .string()
    .required('Abbrevation is requeired')
    .matches(/^[a-zA-z]+([\s][a-zA-Z]+)*$/, 'Special Charaters & Numbers are not Allowed'),
  tAbTwo: yup
    .string()
    .required('Abbrevation is required')
    .matches(/^[a-zA-z]+([\s][a-zA-Z]+)*$/, 'Special Charaters & Numbers are not Allowed'),
  tAbThree: yup
    .string()
    .required('Abbrevation is required')
    .matches(/^[a-zA-z]+([\s][a-zA-Z]+)*$/, 'Special Charaters & Numbers are not Allowed'),
  profileDetail: yup
    .object()
    .shape({
      id: yup.string().required('Profile Detail is required')
    })
    .nullable()
    .required('Profile Detail is required'),
  sortOrder: yup.string().required('Sort Order is required')
    .max(4, 'Sort Order must be less than & equals to 4 digits')
})

export const validationSchemaCarProf = yup.object().shape({
  profileType: yup
    .string()
    .required('Profile Type is required')
    .matches(/^[aA-zZ\s]+$/, 'Special Charaters & Numbers are not Allowed'),
  files: yup.mixed().test('required', 'Please select a file', (value) => {
    return value && value?.length
  })
})

export const validationSchemaNorms = yup.object().shape({
  normsCode: yup
    .string()
    .required('Norms Code is required')
    .matches(/^[a-zA-z]+([\s][a-zA-Z]+)*$/, 'Special Charaters & Numbers are not Allowed'),
  normsDescription: yup
    .string()
    .required('Norms Description is required')
    .matches(/^[a-zA-z]+([\s][a-zA-Z]+)*$/, 'Special Charaters & Numbers are not Allowed'),
  sortOrder: yup.string().required('Sort Order is required')
    .max(4, 'Sort Order must be less than & equals to 4 digits')
})

export const validationSchemaGradNorm = yup.object().shape({
  grade: yup
    .object()
    .shape({
      id: yup.string().required('Grade is required'),
      title: yup.string().required('Grade is required')
    })
    .nullable()
    .required('Grade is required'),
  test: yup
    .object()
    .shape({
      id: yup.string().required('Test is required'),
      title: yup.string().required('Test is required')
    })
    .nullable()
    .required('Test is required'),
  norms: yup
    .object()
    .shape({
      id: yup.string().required('Norms is required'),
      title: yup.string().required('Norms is required')
    })
    .nullable()
    .required('Norms is required'),
  subtest: yup
    .object()
    .shape({
      id: yup.string().required('Sub Test is required'),
      title: yup.string().required('Sub Test is required')
    })
    .nullable()
    .required('Sub Test is required'),
  minmarks: yup
    .number()
    .positive()
    .typeError('Min Marks is required')
    .required('Min Marks is required')
    .min(0, 'Min marks must be greater than 0')
    .max(100, 'Min marks must be less than 100'),
  maxmarks: yup
    .number()
    .positive()
    .typeError('Max Marks is required')
    .required('Max Marks is required')
    .min(0, 'Max marks must be greater than 0')
    .max(100, 'Max marks must be less than 100')
    .moreThan(
      yup.ref('minmarks'),
      'Maximum Marks should be greater than minimum marks'
    )
})

export const validationSchemaTestTimeNorm = yup.object().shape({
  grade: yup
    .object()
    .shape({
      id: yup.string().required('Grade is required'),
      title: yup.string().required('Grade is required')
    })
    .nullable()
    .required('Grade is required'),
  test: yup
    .object()
    .shape({
      id: yup.string().required('Test is required'),
      title: yup.string().required('Test is required')
    })
    .nullable()
    .required('Test is required'),
  subtest: yup
    .object()
    .shape({
      id: yup.string().required('Sub Test is required'),
      title: yup.string().required('Sub Test is required')
    })
    .nullable()
    .required('Test is required'),
  time: yup
    .number()
    .positive()
    .typeError('Time shold be positive')
    .required('Time is required')
})

export const validationSchemaCounsellor = yup.object().shape({
  firstName: yup
    .string()
    .required('First Name is required')
    .min(2, 'First Name must be at least 2 characters')
    .max(20, 'First Name must be at most 20 characters')
    .matches(/^[a-zA-z]+([\s][a-zA-Z]+)*$/, 'Special Characters & Numeric value are not allowed'),
  middleName: yup
    .string()
    .nullable(true)
    .matches(/^([a-zA-z]+([\s][a-zA-Z]+)*)?$/, 'Special Characters & Numeric value are not allowed'),
  lastName: yup
    .string()
    .required('Last Name is required')
    .min(2, 'Last Name must be at least 2 characters')
    .max(20, 'Last Name must be at most 20 characters')
    .matches(/^[a-zA-z]+([\s][a-zA-Z]+)*$/, 'Special Characters & Numeric value are not allowed'),
  mobileNumber: yup
    .string()
    .required('Mobile Number is required')
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Enter valid Mobile Number'),
  country: yup.object().nullable().required('Country is required'),
  state: yup.object().nullable().required('State is required'),
  district: yup.object().nullable().required('District is required'),
  email: yup.string().required('Email is required').email(),
  commision: yup
    .number()
    .positive()
    .typeError('Numbers only')
    .required('Required')
    .min(0)
    .max(100),
  professional_expertness: yup
    .string()
    .nullable(true)
    .matches(/^([a-zA-z0-9]+([\s][a-zA-Z0-9]+)*)?$/, 'Special Characters are not allowed')
})

export const validationSchemaCenter = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(20, 'Name must be at most 20 characters')
    .matches(/^[a-zA-z]+([\s][a-zA-Z]+)*$/, 'Special Characters & Numeric value are not allowed'),
  mobileNumber: yup
    .string()
    .required('Mobile Number is required')
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Enter valid Mobile Number'),
  email: yup
    .string()
    .required('Email is required')
    .matches(/.+@.+\.[A-Za-z]+$/, 'Enter valid E-Mail'),
  country: yup.object().nullable().required('Country is required'),
  state: yup.object().nullable().required('State is required'),
  district: yup.object().nullable().required('District is required')
})

export const validationSchemaSubAdmin = yup.object().shape({
  firstName: yup
    .string()
    .required('first name is required')
    .matches(/^[A-Za-z]+$/, 'Special Characters are not allowed'),
  lastName: yup
    .string()
    .required('lastName is required')
    .matches(/^[A-Za-z]+$/, 'Special Characters are not allowed'),
  mobileNumber: yup
    .string()
    .required('Mobile Number is required')
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Enter valid Mobile Number'),
  email: yup
    .string()
    .required('Email is required')
    .matches(/.+@.+\.[A-Za-z]+$/, 'Enter valid E-Mail'),
  role: yup
    .object()
    .shape({
      id: yup.string().required('Role is required'),
      title: yup.string().required('Role is required')
    })
    .nullable()
    .required('Role is required')
})

export const validationAmountSchema = yup.object().shape({
  amount: yup
    .string()
    .required('Amount is required')
})

export const validationCouponCode = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters'),
  code: yup.string()
    .required('Coupon Code is required')
    .min(5, 'Coupon Code must be at least 5 characters')
    .max(10, 'Coupon Code must be at most 10 characters')
    .matches(/^[a-zA-Z0-9]*$/, 'Special Characters & Numeric value are not allowed'),
  start_date: yup
    .date()
    .typeError('Start date is required')
    .min(
      moment().format('YYYY-MM-DD'),
      `Min start date is ${moment().format('YYYY-MM-DD')}`
    ),
  // .max(
  //   ref('end_date'),
  //   'Invalid date or Min date must be earlier than the max date'
  // ),
  end_date: yup
    .date()
    .typeError('End date is required')
    .min(
      ref('start_date'),
      'Invalid date or Max date must be later than min date'
    ),
  amount_percentage: yup.number()
    .required('This is required')
    .typeError('This is Required')
    .min(1, 'Amount or Percentage must be greater than zero'),
  number_time_use: yup.number()
    .required('This is required')
    .typeError('This is Required')
    .min(1, 'This must be greater than zero')
})

export const validationExportdata = yup.object().shape({
  start_date: yup
    .date()
    .typeError('Start date is required'),
  end_date: yup
    .date()
    .typeError('End date is required')
    .min(
      ref('start_date'),
      'Invalid date'
    )
})
