import { gql } from '@apollo/client'

export const GET_JOBS = gql`
  query GetFrontJobs($input: getJobInput!) {
    getFrontJobs(input: $input) {
      nTotal
      aResults {
        _id
        dCreated
        eDesignation
        eOpeningFor
        fExperienceFrom
        fExperienceTo
        fSalaryFrom
        fSalaryTo
        nOpenPositions
        oLocation {
          sTitle
          _id
        }
        sDescription
        sTitle
        oSeo {
          _id
          sSlug
        }
      }
    }
  }
`
export const GET_JOB_BY_ID = gql`
  query GetFrontJobById($input: getJobById) {
    getFrontJobById(input: $input) {
      _id
      dCreated
      dUpdated
      eDesignation
      eOpeningFor
      fExperienceFrom
      fExperienceTo
      fSalaryFrom
      nOpenPositions
      fSalaryTo
      oLocation {
        sTitle
        _id
      }
      oSeo {
        sTitle
        sSlug
        iId
        _id
      }
      sDescription
      sTitle
    }
  }
`
export const GET_RELATED_JOBS_BY_ID = gql`
  query GetRelatedJobs($input: getRelatedJobInput!) {
    getRelatedJobs(input: $input) {
      nTotal
      aResults {
        _id
        dCreated
        dUpdated
        eDesignation
        fExperienceFrom
        eOpeningFor
        fExperienceTo
        fSalaryFrom
        nOpenPositions
        fSalaryTo
        oLocation {
          sTitle
          _id
        }
        sDescription
        sTitle
        oSeo {
          _id
          sSlug
          iId
        }
      }
    }
  }
`
export const GET_LOCATIONS = gql`
  query GetLocations {
    getLocations {
      sTitle
      _id
    }
  }
`
