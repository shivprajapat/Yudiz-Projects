
const WorkLogTags = [{

  sName: 'Bug Fixing'

}, {

  sName: 'Worked on new feature'

}, {

  sName: 'Research & development'

}, {

  sName: 'Code Improvement'

}, {

  sName: 'Technical work'

}, {

  sName: 'Meeting'

}, {

  sName: 'Others'

},
{
  sName: 'Leave'
}]

class WorkLogTagsSeeder {
  constructor() {
    this.WorkLogTagsModel = require('../models_routes_service/WorkLogs/worklogsTags.model')
    this.WorkLogTags = WorkLogTags
    this.Name = 'WorkLogTagsSeeder'
  }

  async seedDb() {
    try {
      await this.WorkLogTagsModel.deleteMany({})
      await this.WorkLogTagsModel.insertMany(WorkLogTags)
      console.log('WorkLogsTags seeded successfully')
    } catch (error) {
      console.log(error)
      console.log('WorkLogsTags seeding failed')
    } finally {
      console.log('WorkLogsTags seeding operation done')
      // process.exit()
    }
  }
}

module.exports = new WorkLogTagsSeeder()
