const general = {
  requiredField: { message: 'What\'s the hurry, feed the fields otherwise they won\'t let you go ahead', status: 400 },
  accountDeactivated: { message: 'Oops your account has been deactivated, do one thing try to contact the support they will help you.', status: 400 },
  authorizationError: { message: 'Authorization Error, please try logging in again.', status: 401 },
  listNotAuthorized: { message: 'Oops!, Sorry you are not listed here to list ##', status: 401 },
  listMigrationTagNotAuthorized: { message: 'Oops!, Sorry you are not listed here to list migration tags', status: 401 },
  success: { message: '## success', status: 200 },
  fetchSuccess: { message: '## fetch successfully', status: 200 },
  alreadyExists: { message: '## already exists.', status: 419 },
  notFound: { message: '## not found.', status: 404 },
  updateSuccess: { message: '## updated successfully.', status: 200 },
  successfully: { message: '## successfully', status: 200 },
  assignedSuccess: { message: '## assigned successfully', status: 200 },
  changeSuccess: { message: '## changed successfully.', status: 200 }
}

module.exports = general
