const jobProfile = {
    Project_Manager: 'PROJECTMANAGER',
    Business_Development_Executive: 'BUSINESSDEVELOPMENTEXECUTIVE',
    Business_Analyst: 'BUSINESSANALYST'
}

const AllowJobProfileToFetchPm = [
    jobProfile.Project_Manager
]

const AllowJobProfileToFetchBde = [
    jobProfile.Business_Development_Executive
]

const AllowJobProfileToFetchBa = [
    jobProfile.Business_Analyst
]

module.exports = {
    AllowJobProfileToFetchPm,
    AllowJobProfileToFetchBde,
    AllowJobProfileToFetchBa
}
