const Departments = [
  {
    sName: 'HR',
    sKey: 'HR',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(20deg, 100%, 90%)',
    sTextColor: 'hsl(20deg, 65%, 50%)',
    bIsSystem: true,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  },
  {
    sName: 'Admin',
    sKey: 'ADMIN',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(40deg, 100%, 90%)',
    sTextColor: 'hsl(40deg, 65%, 50%)',
    bIsSystem: true,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  },
  {

    sName: 'Sales',
    sKey: 'SALES',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(60deg, 100%, 90%)',
    sTextColor: 'hsl(60deg, 65%, 50%)',
    bIsSystem: true,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  },
  {

    sName: 'Marketing',
    sKey: 'MARKETING',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(80deg, 100%, 90%)',
    sTextColor: 'hsl(80deg, 65%, 50%)',
    bIsSystem: true,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  },
  {
    sName: 'UI/UX',
    sKey: 'UI/UX',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(100deg, 100%, 90%)',
    sTextColor: 'hsl(100deg, 65%, 50%)',
    bIsSystem: false,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  },
  {
    sName: 'Designing',
    sKey: 'DESIGNING',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(120deg, 100%, 90%)',
    sTextColor: 'hsl(120deg, 65%, 50%)',
    bIsSystem: false,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  },
  {
    sName: 'Web Designing',
    sKey: 'WEBDESIGNING',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(140deg, 100%, 90%)',
    sTextColor: 'hsl(140deg, 65%, 50%)',
    bIsSystem: false,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  },
  {
    sName: 'Web Development',
    sKey: 'WEBDEVELOPMENT',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(160deg, 100%, 90%)',
    sTextColor: 'hsl(160deg, 65%, 50%)',
    bIsSystem: false,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  },
  {
    sName: 'Mobile App Development',
    sKey: 'MOBILEAPPDEVELOPMENT',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(180deg, 100%, 90%)',
    sTextColor: 'hsl(180deg, 65%, 50%)',
    bIsSystem: false,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  },
  {
    sName: 'Game Development',
    sKey: 'GAMEDEVELOPMENT',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(200deg, 100%, 90%)',
    sTextColor: 'hsl(200deg, 65%, 50%)',
    bIsSystem: false,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  },
  {
    sName: 'Blockchain',
    sKey: 'BLOCKCHAIN',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(220deg, 100%, 90%)',
    sTextColor: 'hsl(220deg, 65%, 50%)',
    bIsSystem: false,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  },
  {
    sName: 'DevOps',
    sKey: 'DEVOPS',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(240deg, 100%, 90%)',
    sTextColor: 'hsl(240deg, 65%, 50%)',
    bIsSystem: false,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  },
  {
    sName: 'Management',
    sKey: 'MANAGEMENT',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(260deg, 100%, 90%)',
    sTextColor: 'hsl(260deg, 65%, 50%)',
    bIsSystem: true,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  },
  {
    sName: 'Business Analyst',
    sKey: 'BUSINESSANALYST',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(280deg, 100%, 90%)',
    sTextColor: 'hsl(280deg, 65%, 50%)',
    bIsSystem: true,
    aHeadId: []
  },
  {
    sName: 'Quality Assurance',
    sKey: 'QUALITYASSURANCE',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(300deg, 100%, 90%)',
    sTextColor: 'hsl(300deg, 65%, 50%)',
    bIsSystem: true,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  },
  {
    sName: 'Operation',
    sKey: 'OPERATION',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(320deg, 100%, 90%)',
    sTextColor: 'hsl(320deg, 65%, 50%)',
    bIsSystem: true,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  },
  {
    sName: 'Product Development',
    sKey: 'PRODUCTDEVELOPMENT',
    eStatus: 'Y',
    sBackGroundColor: 'hsl(340deg, 100%, 90%)',
    sTextColor: 'hsl(340deg, 65%, 50%)',
    bIsSystem: true,
    iParentId: null,
    nTotal: 0,
    nMoved: 0,
    aHeadId: []
  }
]

class DepartmentSeeder {
  constructor() {
    this.DepartmentModel = require('../models_routes_service/Department/model')
    this.Departments = Departments
    this.Name = 'DepartmentSeeder'
  }

  async seedDb() {
    try {
      await this.DepartmentModel.deleteMany({})
      await this.DepartmentModel.insertMany(Departments)
      console.log('Department seeded successfully')
    } catch (error) {
      console.log(error)
      console.log('Department seeding failed')
    } finally {
      console.log('Department seeding operation done')
      // process.exit()
    }
  }
}

module.exports = new DepartmentSeeder()
