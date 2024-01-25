// const MongoClient = require('mongodb').MongoClient
// const axios = require('axios')
// const { default: mongoose } = require('mongoose')
// const url = 'DB URL'
// const client = new MongoClient(url, {
//   useNewUrlParser: true
// })
// const fun = async () => {
//   await client.connect()
//   console.log('connected')
//   const db = client.db('graphContact')
//   const collection = db.collection('WorkerFields')
//   const searchLetters = [
//     'Musician',
//     'Nurse',
//     'Pharmacist',
//     'Pilot',
//     'Police Officer',
//     'Professor/Teacher',
//     'Programmer/Software Developer',
//     'Psychologist',
//     'Real Estate Agent',
//     'Research Scientist',
//     'Sales Representative',
//     'Social Worker',
//     'Surgeon',
//     'Translator/Interpreter',
//     'Veterinarian',
//     'Web Designer',
//     'Writer/Author',
//     'Academic Advisor',
//     'Actuary',
//     'Air Traffic Controller',
//     'Animator',
//     'Astronomer',
//     'Biologist',
//     'Business Analyst',
//     'Carpenter',
//     'Chemist',
//     'Coach',
//     'Conservationist',
//     'Counselor',
//     'Cryptographer',
//     'Dancer',
//     'Database Administrator',
//     'Decorator',
//     'Detective',
//     'Editor',
//     'Environmental Engineer',
//     'Event Planner',
//     'Film Director',
//     'Fitness Instructor',
//     'Flight Attendant',
//     'Forensic Scientist',
//     'Game Developer',
//     'Geologist',
//     'Hair Stylist',
//     'Historian',
//     'Insurance Agent',
//     'Interior Designer',
//     'Investment Banker',
//     'Landscape Architect',
//     'Librarian',
//     'Linguist',
//     'Magician',
//     'Marine Biologist',
//     'Meteorologist',
//     'Model',
//     'Music Producer',
//     'Occupational Therapist',
//     'Oceanographer',
//     'Operations Manager',
//     'Park Ranger',
//     'Personal Trainer',
//     'Pet Groomer',
//     'Physiotherapist',
//     'Political Scientist',
//     'Product Manager',
//     'Project Manager',
//     'Public Relations Manager',
//     'Radiologist',
//     'Researcher',
//     'Robotics Engineer',
//     'Singer',
//     'Social Media Manager',
//     'Speech Therapist',
//     'Sports Coach',
//     'Tax Consultant',
//     'Tour Guide',
//     'UX Designer',
//     'Video Game Tester',
//     'Volunteer Coordinator',
//     'Welder',
//     'Yoga Instructor'
//   ]
//   for (let j = 0; j < searchLetters.length - 1; j++) {
//     console.log('searchLetters[j]', searchLetters[j])
//     const allData = await axios.get(`https://www.wix.com/_api/adi-category-vsearch-service/api/v1/categories?limit=500&locale=en-US&offset=0&q=${searchLetters[j]}`)
//     if (allData.data.results.length) {
//       for (let i = 0; i < allData.data.results.length - 1; i++) {
//         const isFound = await collection.findOne({
//           displayName: allData.data.results[i].displayName
//         })
//         if (!isFound) await collection.insertOne(allData.data.results[i])
//       }
//     }
//   }
// }

// const scrap = async () => {
//   await client.connect()
//   const db = client.db('graphContact')
//   console.log('connected')
//   const collection = db.collection('WorkerFields')
//   const profession = db.collection('professions')
//   const pipeLine = [
//     {
//       $group: {
//         _id: '$segmentationIndustryId',
//         values: { $push: '$$ROOT' }
//       }

//     }
//   ]
//   function capitalizeFirstLetter (string) {
//     return string.charAt(0).toUpperCase() + string.slice(1)
//   }
//   const response = await collection.aggregate(pipeLine)
//   for await (const doc of response) {
//     const category = doc?._id.split('_')?.map((word) => capitalizeFirstLetter(word))?.join(' ')
//     const findCategory = await profession.findOne({ sName: category })
//     console.log('findCategory', findCategory)
//     let masterCategoryId
//     if (!findCategory) {
//       const masterCategory = await profession.insertOne({
//         sName: category,
//         eStatus: 'Y',
//         dCreatedAt: new Date(),
//         dUpdatedAt: new Date(),
//         __v: 0
//       })
//       masterCategoryId = masterCategory?.insertedId
//     } else {
//       masterCategoryId = findCategory?._id
//     }
//     const subCategory = doc?.values
//     subCategory?.map(async (category) => {
//       const title = category?.displayName
//       const isDataExists = await profession.findOne({ sName: title })
//       if (!isDataExists) {
//         const response = await profession.insertOne({
//           sName: title,
//           iProfessionId: new mongoose.Types.ObjectId(masterCategoryId),
//           eStatus: 'Y',
//           dCreatedAt: new Date(),
//           dUpdatedAt: new Date(),
//           __v: 0
//         })
//         console.log('response', response)
//       }
//     })
//   }
// }
// // scrap()
