const { addJob, editJob, deleteJob, getJobs, getJobById, bulkJobUpdate, getLocations, getFrontJobs, getFrontJobById, getRelatedJobs } = require('./controllers')

const Mutation = {
  addJob,
  editJob,
  bulkJobUpdate,
  deleteJob
}

const Query = {
  getJobs,
  getJobById,
  getLocations,
  getFrontJobs,
  getFrontJobById,
  getRelatedJobs
}

const jobGetData = {
  oSubAdmin: (job) => {
    return { __typename: 'subAdmin', _id: job.iSubmittedBy }
  },
  oSeo: (job) => {
    return { __typename: 'Seo', iId: job._id }
  }
}

const jobFrontGetData = {
  oSubAdmin: (job) => {
    return { __typename: 'subAdmin', _id: job.iSubmittedBy }
  },
  oSeo: (job) => {
    return { __typename: 'Seo', iId: job._id }
  }
}

const resolvers = { Mutation, Query, jobGetData, jobFrontGetData }

module.exports = resolvers
