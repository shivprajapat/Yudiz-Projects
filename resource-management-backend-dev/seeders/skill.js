
const Skills = [
  {
    _id: '62bae1b656100b36883a1eef',
    sName: 'Speaking',
    sKey: 'SPEAKING',
    eStatus: 'Y'
  }
]

class SkillSeeder {
  constructor() {
    this.SkillModel = require('../models_routes_service/Skill/model')
    this.Skills = Skills
    this.Name = 'SkillSeeder'
  }

  async seedDb() {
    try {
      await this.SkillModel.deleteMany({})
      await this.SkillModel.insertMany(Skills)
      console.log('Skill seeded successfully')
    } catch (error) {
      console.log(error)
      console.log('Skill seeding failed')
    } finally {
      console.log('Skill seeding operation done')
      // process.exit()
    }
  }
}

module.exports = new SkillSeeder()
