export const validationErrors = {
  required: 'This field is required.',
  email: 'Please enter a valid email address.',
  number: 'Please enter a valid number.',
  digit: 'Please enter only digits.',
  minLength: (length) => `Please enter a value greater than or equal to ${length}`,
  maxLength: (length) => `Please enter a value less than or equal to ${length}`,
  rangeLength: (min, max) => `Please enter a value between ${min} and ${max} characters long`,
  passwordRegEx: 'Password must contain 1 number, uppercase, lowercase, and special character.',
  passwordNotMatch: 'Please enter same password',
  noSPace: 'This field consisting only of non-whitespaces',
  pleaseLoginToWriteComment: 'Please login to write a comment',
  noSpecialCharacters: 'This field does not consist of special characters',
  url: 'Please enter valid URL'
}
