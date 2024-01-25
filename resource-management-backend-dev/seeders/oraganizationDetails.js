const OrganizationDetails = [
    {
        sName: 'Yudiz Solutions LTD. OK',
        sKey: 'YUDIZSOLUTIONSLTD.OK',
        nHoursPerDay: 7,
        nDaysPerMonth: 22,
        eStatus: 'Y',
        nMaxHoursPerDay: 8,
        nMaxHoursPerMonth: 160,
        nMaxMinutesPerDay: 480,
        nMaxMinutesPerMonth: 9600,
        nFoundedYear: 1947,
        sLogo: '',
        sUrl: 'https://jr-web-developer.s3.ap-south-1.amazonaws.com/Organization/OrgDetails/1690805878959_yudiz.jpg',
        sOrganizationUrl: 'http://rmp.webdevprojects.cloud/login',
        dRemoveNetworkLogsDate: new Date(),
        dRemoveOperationLogsDate: new Date()
    }
]

class OrganizationDetailSeeder {
    constructor() {
        this.OrganizationDetailModel = require('../models_routes_service/organizationDetail/model')
        this.OrganizationDetails = OrganizationDetails
        this.Name = 'OrganizationDetailSeeder'
    }

    async seedDb() {
        try {
            await this.OrganizationDetailModel.deleteMany({})
            await this.OrganizationDetailModel.insertMany(OrganizationDetails)
            console.log('OrganizationDetail seeded successfully')
        } catch (error) {
            console.log(error)
            console.log('OrganizationDetail seeding failed')
        } finally {
            console.log('OrganizationDetail seeding operation done')
            // process.exit()
        }
    }
}

module.exports = new OrganizationDetailSeeder()
