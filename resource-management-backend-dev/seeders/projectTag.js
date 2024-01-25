
const ProjectTags = [
  {
    _id: '63918ef018c9b8fcf29e1ca4',
    sName: 'Automation',
    sKey: 'AUTOMATION',
    sBackGroundColor: 'hsl(236deg, 100%, 90%)',
    sTextColor: 'hsl(236deg, 65%, 50%)',
    eStatus: 'Y'
  }

]

class ProjectTagSeeder {
  constructor() {
    this.ProjectTagModel = require('../models_routes_service/ProjectTag/model')
    this.ProjectTags = ProjectTags
    this.Name = 'ProjectTagSeeder'
  }

  async seedDb() {
    try {
      await this.ProjectTagModel.deleteMany({})
      await this.ProjectTagModel.insertMany(ProjectTags)
      console.log('ProjectTag seeded successfully')
    } catch (error) {
      console.log(error)
      console.log('ProjectTag seeding failed')
    } finally {
      console.log('ProjectTag seeding operation done')
      // process.exit()
    }
  }
}

module.exports = new ProjectTagSeeder()
