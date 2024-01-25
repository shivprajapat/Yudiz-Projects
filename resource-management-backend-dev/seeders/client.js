const Clients = [
  {
    sName: 'Hemal Pansuriya',
    sMobNum: '5556663332',
    sEmail: 'hemalpasuriya233@gmail.com',
    sCountry: 'Israel',
    sCode: 'il',
    sOtherInfo: 'hello folks',
    eStatus: 'Y',
    sFlagImage: 'https://jr-web-developer.s3.ap-south-1.amazonaws.com/flags/il.png'
  }
]

class ClientSeeder {
  constructor() {
    this.ClientModel = require('../models_routes_service/Client/model')
    this.Clients = Clients
    this.Name = 'ClientSeeder'
  }

  async seedDb() {
    try {
      await this.ClientModel.deleteMany({})
      await this.ClientModel.insertMany(Clients)
      console.log('Client seeded successfully')
    } catch (error) {
      console.log(error)
      console.log('Client seeding failed')
    } finally {
      console.log('Client seeding operation done')
      // process.exit()
    }
  }
}

module.exports = new ClientSeeder()
