const general = {
  requiredField: { message: 'What\'s the hurry, feed the fields otherwise they won\'t let you go ahead', status: 200 },
  accountDeactivated: { message: 'Oops your account has been deactivated, do one thing try to contact the support they will help you.', status: 200 },
  invalidEmail: { message: 'Write proper email.', status: 200 },
  authorizationError: { message: 'Oops! You are not logged in. Please login and try again.', status: 200 },
  articleUnderReview: { message: 'Oops!, Sorry you cannot edit your article as it is under review', status: 200 },
  createJobNotAuthorized: { message: 'Oops!, Sorry you are not listed here to create job', status: 200 },
  editJobNotAuthorized: { message: 'Oops!, Sorry you are not listed here to edit job', status: 200 },
  getJobNotAuthorized: { message: 'Oops!, Sorry you are not listed here to get job', status: 200 },
  listJobNotAuthorized: { message: 'Oops!, Sorry you are not listed here to list job', status: 200 },
  deleteJobNotAuthorized: { message: 'Oops!, Sorry you are not listed here to delete job', status: 200 },
  listEnquiryNotAuthorized: { message: 'Oops!, Sorry you are not listed here to list enquiries', status: 200 },
  updateJobStatusNotAuthorized: { message: 'Oops!, Sorry you are not listed here to update job status', status: 200 },
  invalid: { message: '## is invalid.', status: 200 },
  addSuccess: { message: '## added successfully.', status: 200 },
  notFound: { message: '## not found.', status: 404 },
  updateSuccess: { message: '## updated successfully.', status: 200 },
  alreadyDeleted: { message: '## already deleted.', status: 200 },
  deleteSuccess: { message: '## deleted successfully', status: 200 },
  formFieldInvalid: { message: '## field invalid', status: 200 },
  jobApplySuccess: { message: 'Job applied successfully.', status: 200 },
  jobAlreadyApply: { message: 'You are aplready applied for this job.', status: 200 },
  jobAlreadyExist: { message: 'Job post of this title already exist!', status: 200 }
}

module.exports = general
