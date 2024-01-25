const DepartmentSeeder = require('./department')
const TechnologySeeder = require('./technology')
const SkillSeeder = require('./skill')
const ProjectTagSeeder = require('./projectTag')
const JobProfileSeeder = require('./jobProfile')
const ClientSeeder = require('./client')
const WorkLogTagsSeeder = require('./workLogTags')
const OrganizationDetailSeeder = require('./oraganizationDetails')
const PermissionSeeder = require('./permission')
const RoleSeeder = require('./role')
const EmployeeSeeder = require('./employee')
const CurrencySeeder = require('./currencies')
const OrganizationBranchSeeder = require('./organizationBranch')
const CountrySeeder = require('./countries')
const StateSeeder = require('./states')
const CitySeeder = require('./cities')
const { ResourceManagementDB } = require('../database/mongoose')

const seed = [
  CountrySeeder,
  StateSeeder,
  CitySeeder
  // OrganizationDetailSeeder,
  // CurrencySeeder,
  // PermissionSeeder
  // RoleSeeder
  // OrganizationDetailSeeder,
  // DepartmentSeeder
  // TechnologySeeder
  // SkillSeeder,
  // ProjectTagSeeder,
  // JobProfileSeeder
  // ClientSeeder,
  // WorkLogTagsSeeder,
  // EmployeeSeeder
]

class Seeder {
  constructor() {
    this.seed = seed
    console.log({
      ConnectionString: ResourceManagementDB._connectionString,
      connectionOptions: ResourceManagementDB._connectionOptions,
      ConnectionModel: ResourceManagementDB.models
    }
    )
  }

  async seedDb() {
    try {
      for (const seeder of this.seed) {
        console.log('Seeding start of ', seeder.Name)
        const start = performance.now()
        await seeder.seedDb()
        const stop = performance.now()
        const inSeconds = (stop - start) / 1000
        const rounded = Number(inSeconds).toFixed(3)
        console.log(`businessLogic: ${rounded}s`)
        console.log('Seeding end of ', seeder.Name)
      }
    } catch (error) {
      console.log(error)
    } finally {
      console.log('Seeding done')
      process.exit()
    }
  }
}

const seeder = new Seeder()
seeder.seedDb()
