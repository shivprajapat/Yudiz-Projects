
const Technologies = [
  {
    _id: '6391d2a16351927d10ae2e7e',
    sName: 'Machine Learning',
    sKey: 'MACHINELEARNING',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(285deg, 100%, 90%)',
    sTextColor: 'hsl(285deg, 65%, 50%)',
    sLogo: 'Technology/1685611880408_ascascac1.jpg'
  }

]

class TechnologySeeder {
  constructor() {
    this.TechnologyModel = require('../models_routes_service/Technology/model')
    this.Technologies = Technologies
    this.Name = 'TechnologySeeder'
  }

  async seedDb() {
    try {
      await this.TechnologyModel.deleteMany({})
      await this.TechnologyModel.insertMany(Technologies)
      console.log('Technology seeded successfully')
    } catch (error) {
      console.log(error)
      console.log('Technology seeding failed')
    } finally {
      console.log('Technology seeding operation done')
      // process.exit()
    }
  }
}

module.exports = new TechnologySeeder()
