import * as yup from 'yup'
import moment from 'moment'

// For SignUp - Phase - 1
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', '.png']
let startdate = moment()
startdate = startdate.subtract(15, 'years')
startdate = startdate.format('YYYY-MM-DD')

// Validations Regex
const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/
// const emailRegex = /.+@.+\.[A-Za-z]+$/
const notRequireEmailregex = /^$|^\S+.*.+@.+\.[A-Za-z]+$/
// const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const passRegex = /^[a-zA-Z0-9!@#$%^&*]{6,}$/
// const specialCharRegex = /^[aA-zZ\s]+$/
// const specialCharRegex = /^[A-Za-z]+$/
const passRegexChange =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
// For Login
export const validationLoginSchema = yup.object().shape({
  emailMob: yup
    .string()
    .required('E-Mail/Mobile Number is required')
    .test('test-name', 'Enter Valid E-Mail/Mobile Number', function (value) {
      const emailRegex = /.+@.+\.[A-Za-z]+$/
      const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/
      const isValidEmail = emailRegex.test(value)
      const isValidPhone = phoneRegex.test(value)
      if (!isValidEmail && !isValidPhone) {
        return false
      }
      return true
    }),
  password: yup.string().required('Password is required')
})

// For SignUp - Phase - 1
export const validationSignUpUserSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First Name is required')
    .min(2, 'First Name must be at least 2 characters')
    .max(20, 'First Name must be at most 20 characters')
    .matches(
      /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
      'Special Characters & Numeric value are not allowed'
    ),
  middleName: yup
    .string()
    .required('Middle Name is required')
    .min(2, 'Middle Name must be at least 2 characters')
    .max(20, 'Middle Name must be at most 20 characters')
    .matches(
      /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
      'Special Characters & Numeric value are not allowed'
    ),
  lastName: yup
    .string()
    .required('Last Name is required')
    .min(2, 'Last Name must be at least 2 characters')
    .max(20, 'Last Name must be at most 20 characters')
    .matches(
      /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
      'Special Characters & Numeric value are not allowed'
    ),
  dob: yup
    .date()
    .required('Date of Birth is required')
    .typeError('Date of Birth is required')
    .max(startdate, 'Enter valid date'),
  gender: yup.string().required('Gender is required').nullable(),
  fName: yup
    .string()
    .required('Father Name is required')
    .min(2, 'Father Name must be at least 2 characters')
    .max(20, 'Father Name must be at most 20 characters')
    .matches(
      /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
      'Special Characters & Numeric value are not allowed'
    ),
  mName: yup
    .string()
    .required('Mother Name is required')
    .min(2, 'Mother Name must be at least 2 characters')
    .max(20, 'Mother Name must be at most 20 characters')
    .matches(
      /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
      'Special Characters & Numeric value are not allowed'
    ),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the policy terms and conditions'),
  mobileNumber: yup
    .string()
    .required('Mobile Number is required')
    .matches(phoneRegex, 'Enter valid Mobile Number'),
  email: yup
    .string()
    // .required('Email is required')
    .matches(notRequireEmailregex, 'Enter valid E-Mail'),
  password: yup
    .string()
    .required('Password is required')
    // .min(6, 'Password is too short - should be 6 chars minimum.'),
    .matches(
      passRegex,
      // 'Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters'
      'Password should have at Least 6 characters'
    ),
  cPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf(
      [yup.ref('password'), null],
      'Password and Confirm password must be same '
    )
})

// For OTP Input Field
export const validationOTPSchema = yup.object().shape({
  input1: yup
    .string()
    .required('OTP is required')
    .matches(/^[0-9]*$/, 'Only numbers are allowed'),
  input2: yup
    .string()
    .required('OTP is required')
    .matches(/^[0-9]*$/, 'Only numbers are allowed'),
  input3: yup
    .string()
    .required('OTP is required')
    .matches(/^[0-9]*$/, 'Only numbers are allowed'),
  input4: yup
    .string()
    .required('OTP is required')
    .matches(/^[0-9]*$/, 'Only numbers are allowed')
})

// Validation-Scheme for signup
export const validationSignupSchema = yup.object().shape({
  // standard: yup.string().required('Standard is required'),
  standard: yup
    .object()
    .shape({
      label: yup.string().required('Standard is required'),
      value: yup.string().required('Standard is required')
    })
    .nullable() // for handling null value when clearing options via clicking "x"
    .required('Standard is required'),
  board: yup
    .object()
    .shape({
      title: yup.string().required('Board is required'),
      id: yup.string().required('Board is required')
    })
    .nullable() // for handling null value when clearing options via clicking "x"
    .required('Board is required'),
  nationality: yup
    .object()
    .shape({
      label: yup.string().required('Nationality is required'),
      value: yup.string().required('Nationality is required')
    })
    .nullable() // for handling null value when clearing options via clicking "x"
    .required('Nationality is required'),
  country: yup
    .object()
    .shape({
      title: yup.string().required('Country is required'),
      id: yup.string().required('Country is required')
    })
    .nullable() // for handling null value when clearing options via clicking "x"
    .required('Country is required'),
  state: yup
    .object()
    .shape({
      title: yup.string().required('State is required'),
      id: yup.string().required('State is required')
    })
    .nullable() // for handling null value when clearing options via clicking "x"
    .required('State is required'),
  district: yup
    .object()
    .shape({
      title: yup.string().required('District is required'),
      id: yup.string().required('District is required')
    })
    .nullable() // for handling null value when clearing options via clicking "x"
    .required('District is required'),
  pincode: yup
    .string()
    .required('Pincode is required')
    .matches(/^[\w]*$/, 'Negative numbers not allowed')
    .min(5, 'Pincode must be greater than & equals to 5 digits')
    .max(10, 'Pincode must be less than & equals to 10 digits'),
  school_name: yup
    .string()
    .required('School Name is required')
    .matches(/^[ A-Za-z0-9_./-]*$/, 'Invalid Format')
    .min(5, 'School Name must be greater than & equals to 5 characters'),
  address1: yup
    .string()
    .required('Address is required')
    .matches(/^(?!\s)[\w\s-&+,:;@#]*$/, 'Invalid format')
    .min(10, 'Address must be at least 10 characters')
    .max(150, 'Address must be at most 150 characters'),
  address2: yup
    .string()
    .required('Address is required')
    .matches(/^(?!\s)[\w\s-&+,:;@#]*$/, 'Invalid format')
    .min(10, 'Address must be at least 10 characters')
    .max(150, 'Address must be at most 150 characters'),
  schoolCountry: yup
    .object()
    .shape({
      title: yup.string().required('Country is required'),
      id: yup.string().required('Country is required')
    })
    .nullable() // for handling null value when clearing options via clicking "x"
    .required('Country is required'),
  schoolState: yup
    .object()
    .shape({
      title: yup.string().required('State is required'),
      id: yup.string().required('State is required')
    })
    .nullable() // for handling null value when clearing options via clicking "x"
    .required('State is required'),
  schoolDistrict: yup
    .object()
    .shape({
      title: yup.string().required('District is required'),
      id: yup.string().required('District is required')
    })
    .nullable() // for handling null value when clearing options via clicking "x"
    .required('District is required'),
  schoolPincode: yup
    .string()
    .required('Pincode is required')
    .matches(/^[\w]*$/, 'Negative numbers not allowed')
    .min(5, 'Pincode must be greater than & equals to 5 digits')
    .max(10, 'Pincode must be less than & equals to 10 digits')
})

// Validation for Edit Profile
export const validationEditProfileSchema = yup.object().shape({
  files: yup
    .mixed()
    .required('File is required')
    .test('required', 'File is required', (val) => {
      return val && val.length
    })
    .test(
      'format',
      'Only Image allowed',
      (value) => value && SUPPORTED_FORMATS.includes(value[0]?.type)
    ),
  firstName: yup
    .string()
    .required('First Name is required')
    .min(2, 'First Name must be at least 2 characters')
    .max(20, 'First Name must be at most 20 characters')
    .matches(
      /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
      'Special Characters & Numeric value are not allowed'
    ),
  middleName: yup
    .string()
    .required('Middle Name is required')
    .min(2, 'Middle Name must be at least 2 characters')
    .max(20, 'Middle Name must be at most 20 characters')
    .matches(
      /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
      'Special Characters & Numeric value are not allowed'
    ),
  lastName: yup
    .string()
    .required('Last Name is required')
    .min(2, 'Last Name must be at least 2 characters')
    .max(20, 'Last Name must be at most 20 characters')
    .matches(
      /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
      'Special Characters & Numeric value are not allowed'
    ),
  motherName: yup
    .string()
    .required('Mother Name is required')
    .min(2, 'Mother Name must be at least 2 characters')
    .max(20, 'Mother Name must be at most 20 characters')
    .matches(
      /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
      'Special Characters & Numeric value are not allowed'
    ),
  fatherName: yup
    .string()
    .required('Father Name is required')
    .min(2, 'Father Name must be at least 2 characters')
    .max(20, 'Father Name must be at most 20 characters')
    .matches(
      /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
      'Special Characters & Numeric value are not allowed'
    ),
  dob: yup
    .date()
    .required('Date of Birth is required')
    .typeError('Date of Birth is required')
    .max(startdate, 'Enter valid date'),
  mobileNumber: yup
    .string()
    .required('Mobile Number is required')
    .matches(phoneRegex, 'Enter valid Mobile Number'),
  email: yup
    .string()
    // .required('Email is required')
    .matches(notRequireEmailregex, 'Enter valid E-Mail'),
  country2: yup
    .object()
    .nullable() // for handling null value when clearing options via clicking "x"
    .required('Country is required'),
  state: yup
    .object()
    .shape({
      title: yup.string().required('State is required'),
      id: yup.string().required('State is required')
    })
    .nullable() // for handling null id when clearing options via clicking "x"
    .required('State is required'),
  district: yup
    .object()
    .shape({
      title: yup.string().required('District is required'),
      id: yup.string().required('District is required')
    })
    .nullable() // for handling null id when clearing options via clicking "x"
    .required('District is required'),
  pincode: yup
    .string()
    .required('Pincode is required')
    .matches(/^[\w]*$/, 'Negative numbers not allowed')
    .min(5, 'Pincode must be greater than & equals to 5 digits')
    .max(10, 'Pincode must be less than & equals to 10 digits'),
  nationality: yup
    .object()
    .nullable() // for handling null id when clearing options via clicking "x"
    .required('Nationality is required'),
  board: yup
    .object()
    .shape({
      title: yup.string().required('Board is required'),
      id: yup.string().required('Board is required')
    })
    .nullable() // for handling null id when clearing options via clicking "x"
    .required('Board is required'),
  grade: yup
    .object()
    .shape({
      title: yup.string().required('Grade is required'),
      id: yup.string().required('Grade is required')
    })
    .nullable() // for handling null id when clearing options via clicking "x"
    .required('Grade is required'),
  school_name: yup
    .string()
    .required('School Name is required')
    .matches(/^[ A-Za-z0-9_./-]*$/, 'Invalid Format')
    .min(5, 'School Name must be greater than & equals to 5 characters'),
  addressLine1: yup.string().required('Address is required'),
  addressLine2: yup.string().required('Address is required'),
  country: yup
    .object()
    .nullable() // for handling null value when clearing options via clicking "x"
    .required('Country is required'),
  state2: yup
    .object()
    .nullable() // for handling null id when clearing options via clicking "x"
    .required('State is required'),
  district2: yup
    .object()
    .nullable() // for handling null id when clearing options via clicking "x"
    .required('District is required'),
  pincode2: yup
    .string()
    .required('Pincode is required')
    .matches(/^[\w]*$/, 'Negative numbers not allowed')
    .min(5, 'Pincode must be greater than & equals to 5 digits')
    .max(10, 'Pincode must be less than & equals to 10 digits')
})

// Validations Schema
export const validationChangePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required('Please Enter Current Password'),
  password: yup
    .string()
    .required('Password is required')
    .matches(
      passRegexChange,
      'Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters'
    ),
  cPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf(
      [yup.ref('password'), null],
      'Password and Confirm password must be same '
    )
})
