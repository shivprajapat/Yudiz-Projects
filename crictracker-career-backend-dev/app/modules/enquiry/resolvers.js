const { applyJob, deleteEnquiry, bulkEnquiryUpdate, getEnquiries, getEnquiryById, generateCVPreSignedUrl } = require('./controllers')

const Mutation = {
  applyJob,
  bulkEnquiryUpdate,
  deleteEnquiry,
  generateCVPreSignedUrl
}

const Query = {
  getEnquiries,
  getEnquiryById
}

const resolvers = { Mutation, Query }

module.exports = resolvers
