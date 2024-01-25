const general = {
  requiredField: { message: 'What\'s the hurry, feed the fields otherwise they won\'t let you go ahead', status: 400 },
  accountDeactivated: { message: 'Oops your account has been deactivated, do one thing try to contact the support they will help you.', status: 401 },
  invalidEmail: { message: 'Write proper email.', status: 400 },
  invalidNumber: { message: 'Write proper mobile number of 10 digits.', status: 400 },
  authorizationError: { message: 'Oops! You are not logged in. Please login and try again.', status: 401 },
  getFeedbackNotAuthorized: { message: 'Oops!, Sorry you are not listed here to get feedback', status: 401 },
  listFeedbackNotAuthorized: { message: 'Oops!, Sorry you are not listed here to list feedback', status: 401 },
  deleteFeedbackNotAuthorized: { message: 'Oops!, Sorry you are not listed here to delete feedback', status: 401 },
  getContactNotAuthorized: { message: 'Oops!, Sorry you are not listed here to get contact', status: 401 },
  listContactNotAuthorized: { message: 'Oops!, Sorry you are not listed here to list contact', status: 401 },
  deleteContactNotAuthorized: { message: 'Oops!, Sorry you are not listed here to delete contact', status: 401 },
  fetchSuccess: { message: '## fetch successfully', status: 200 },
  notFound: { message: '## not found.', status: 404 },
  alreadyDeleted: { message: '## already deleted.', status: 419 },
  deleteSuccess: { message: '## deleted successfully', status: 200 },
  contactUs: { message: 'Thank you for contacting us.', status: 200 },
  feedbackSuccess: { message: 'Thank you for providing your valuable feedback to us.', status: 200 }
}

module.exports = general
