
const JobProfiles = [
  {
    sName: 'Admin',
    sKey: 'ADMIN',
    sPrefix: 'Superior',
    eStatus: 'Y',
    bIsSystem: true,
    nTotal: 0,
    nLevel: 5,
    sLevel: 'EMP'
  },
  {
    sName: 'HR Manager',
    sKey: 'HRMANAGER',
    sPrefix: 'Superior',
    eStatus: 'Y',
    bIsSystem: true,
    nTotal: 1,
    nLevel: 5,
    sLevel: 'EMP'
  },
  {
    sName: 'Functional Manager',
    sKey: 'FUNCTIONALMANAGER',
    sPrefix: 'Head',
    eStatus: 'Y',
    bIsSystem: true,
    nTotal: 0,
    nLevel: 5,
    sLevel: 'EMP'
  },
  {
    sName: 'Tech Lead',
    sKey: 'TECHLEAD',
    sPrefix: 'Lead',
    eStatus: 'Y',
    bIsSystem: true,
    nTotal: 0,
    nLevel: 5,
    sLevel: 'EMP'
  },
  {
    sName: 'Team Lead',
    sKey: 'TEAMLEAD',
    sPrefix: 'Lead',
    eStatus: 'Y',
    bIsSystem: true,
    nTotal: 0,
    nLevel: 5,
    sLevel: 'EMP'
  },
  {
    sName: 'Web Developer',
    sKey: 'WEBDEVELOPER',
    sPrefix: 'Sr',
    eStatus: 'Y',
    bIsSystem: true,
    nTotal: 0,
    nLevel: 5,
    sLevel: 'EMP'
  },
  {
    sName: 'Web Developer',
    sKey: 'WEBDEVELOPER',
    sPrefix: 'Jr',
    eStatus: 'Y',
    bIsSystem: true,
    nTotal: 0,
    nLevel: 5,
    sLevel: 'EMP'
  },
  {
    sName: 'Project Manager',
    sKey: 'PROJECTMANAGER',
    sPrefix: 'Head',
    eStatus: 'Y',
    bIsSystem: true,
    nTotal: 0,
    nLevel: 5,
    sLevel: 'EMP'
  },
  {
    sName: 'Business Analyst',
    sKey: 'BUSINESSANALYST',
    sPrefix: 'Jr',
    eStatus: 'Y',
    bIsSystem: true,
    nTotal: 0,
    nLevel: 5,
    sLevel: 'EMP'
  },
  {
    sName: 'Business Development Executive',
    sKey: 'BUSINESSDEVELOPMENTEXECUTIVE',
    sPrefix: 'Sr',
    eStatus: 'Y',
    bIsSystem: true,
    nTotal: 0,
    nLevel: 5,
    sLevel: 'EMP'
  },
  {
    sName: 'Business Development Executive',
    sKey: 'BUSINESSDEVELOPMENTEXECUTIVE',
    sPrefix: 'Jr',
    eStatus: 'Y',
    bIsSystem: true,
    nTotal: 0,
    nLevel: 5,
    sLevel: 'EMP'
  }
]

class JobProfileSeeder {
  constructor() {
    this.JobProfileModel = require('../models_routes_service/JobProfile/model')
    this.JobProfiles = JobProfiles
    this.Name = 'JobProfileSeeder'
  }

  async seedDb() {
    try {
      await this.JobProfileModel.deleteMany({})
      await this.JobProfileModel.insertMany(JobProfiles)
      console.log('JobProfile seeded successfully')
    } catch (error) {
      console.log(error)
      console.log('JobProfile seeding failed')
    } finally {
      console.log('JobProfile seeding operation done')
      // process.exit()
    }
  }
}

module.exports = new JobProfileSeeder()
