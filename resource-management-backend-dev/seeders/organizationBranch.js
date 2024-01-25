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

const CountryModel = require('../models_routes_service/OrganizationBranch/country.model')

const StateModel = require('../models_routes_service/OrganizationBranch/state.model')

const CityModel = require('../models_routes_service/OrganizationBranch/city.model')

class OrganizationBranchSeeder {
    constructor() {
        this.OrganizationBranchModel = require('../models_routes_service/OrganizationBranch/model')
        this.OrganizationBranches = OrganizationBranches
        this.Name = 'OrganizationBranchSeeder'
    }

    async seedDb() {
        try {
            await this.OrganizationBranchModel.deleteMany({})

            for (const branch of OrganizationBranches) {
                const CountryId = await CountryModel.findOne({
                    sName: branch.iCountryId
                })
                const StateId = await StateModel.findOne({
                    sName: branch.iStateId
                })
                const CityId = await CityModel.findOne({
                    sName: branch.iCityId
                })

                console.log(CountryId)

                branch.iCountryId = CountryId._id
                branch.iStateId = StateId._id
                branch.iCityId = CityId._id

                console.log(branch)

                await this.OrganizationBranchModel.create(branch)
            }

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
