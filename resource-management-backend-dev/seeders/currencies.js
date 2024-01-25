const Currencies = [
  {
    sName: 'Indian Rupee',
    sSymbol: 'INR',
    nUSDCompare: 82.7,
    eStatus: 'Y'
  },
  {
    sName: 'Us Dollar',
    sSymbol: 'USD',
    nUSDCompare: 1,
    eStatus: 'Y'
  },
  {
    sName: 'Euro',
    sSymbol: 'EUR',
    nUSDCompare: 0.93,
    eStatus: 'Y'
  },
  {
    sName: 'Canadian Dollar',
    sSymbol: 'CAD',
    nUSDCompare: 1.33,
    eStatus: 'Y'
  },
  {
    sName: 'Uae Dirham',
    sSymbol: 'AED',
    nUSDCompare: 3.67,
    eStatus: 'Y'
  },
  {
    sName: 'Pound Sterling',
    sSymbol: 'GBP',
    nUSDCompare: 0.82,
    eStatus: 'Y'
  }
]

class CurrencySeeder {
  constructor() {
    this.CurrencyModel = require('../models_routes_service/Currency/model')
    this.Currencies = Currencies
    this.Name = 'DepartmentSeeder'
  }

  async seedDb() {
    try {
      await this.CurrencyModel.deleteMany({})
      await this.CurrencyModel.insertMany(Currencies)
      console.log('Currency seeded successfully')
    } catch (error) {
      console.log(error)
      console.log('Currency seeding failed')
    } finally {
      console.log('Currency seeding operation done')
      // process.exit()
    }
  }
}

module.exports = new CurrencySeeder()
