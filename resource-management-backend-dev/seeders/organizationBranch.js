const OrganizationBranches = [
    {
        sName: 'Bsquare',
        sKey: 'BSQUARE',
        sAddress: 'ambili road.',
        iCountryId: 'India',
        iStateId: 'Gujarat',
        iCityId: 'Ahmedabad',
        nSeatingCapacity: 500,
        eStatus: 'Y',
        bIsHeadquarter: true,
        sLatitude: null,
        sLongitude: null,
        nCurrentEmployee: 0
    }

]

class OrganizationBranchSeeder {
    constructor() {
        this.OrganizationBranchModel = require('../models_routes_service/OrganizationBranch/model')
        this.OrganizationBranches = OrganizationBranches
        this.Name = 'OrganizationBranchSeeder'
    }

    async seedDb() {
        try {
            await this.OrganizationBranchModel.deleteMany({})
            await this.OrganizationBranchModel.insertMany(OrganizationBranches)
            console.log('OrganizationBranches seeded successfully')
        } catch (error) {
            console.log(error)
            console.log('OrganizationBranches seeding failed')
        } finally {
            console.log('OrganizationBranches seeding operation done')
            // process.exit()
        }
    }
}

module.exports = new OrganizationBranchSeeder()
