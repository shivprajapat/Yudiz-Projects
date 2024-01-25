const general = {
  requiredField: { message: 'What\'s the hurry, feed the fields otherwise they won\'t let you go ahead', status: 400 },
  authorizationError: { message: 'Oops! You are not logged in. Please login and try again.', status: 419 },
  deleteCurrentSeriesNotAuthorized: { message: 'Oops!, Sorry you are not listed here to delete Current Series', status: 401 },
  listCurrentSeriesNotAuthorized: { message: 'Oops!, Sorry you are not listed here to list Current Series', status: 401 },
  createCurrentSeriesNotAuthorized: { message: 'Oops!, Sorry you are not listed here to add Current Series', status: 401 },
  updateCurrentSeriesStatusNotAuthorized: { message: 'Oops!, Sorry you are not listed here to update Current Series status', status: 401 },
  invalid: { message: '## is invalid.', status: 400 },
  addSuccess: { message: '## added successfully.', status: 200 },
  notFound: { message: '## not found.', status: 404 },
  updateSuccess: { message: '## updated successfully.', status: 200 },
  statusOk: 200,
  statusBadRequest: 400,
  wentWrong: 'Something went wrong.',
  rankingUpdateSuccess: 'ICC Rankings updated successfully.',
  invalidStartDate: { message: 'Invalid start date', status: 400 },
  invalidDateRange: { message: 'Please provide valid date range', status: 400 },
  deleteSuccess: { message: '## deleted successfully', status: 200 },
  createPollNotAuthorized: { message: 'Oops!, Sorry you are not listed here to create poll', status: 401 },
  editPollNotAuthorized: { message: 'Oops!, Sorry you are not listed here to edit poll', status: 401 },
  viewPollNotAuthorized: { message: 'Oops!, Sorry you are not listed here to view poll', status: 401 },
  deletePollNotAuthorized: { message: 'Oops!, Sorry you are not listed here to delete poll', status: 401 },
  editHomeWidgetsNotAuthorized: { message: 'Oops!, Sorry you are not listed here to edit home widgets', status: 401 }
}

module.exports = general
