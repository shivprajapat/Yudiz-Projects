function deepClone(obj) {
  let cloned = Array.isArray(obj) ? [] : {}
  for (let key in obj) cloned[key] = typeof obj[key] === 'object' && obj[key] !== null ? deepClone(obj[key]) : obj[key]
  return cloned
}

// function deepClone(obj) {
//   let cloned = Array.isArray(obj) ? [] : {}
//   if (Array.isArray(obj)) return obj?.map((a) => deepClone(a))
//   Object.keys(obj).forEach((key) => (cloned[key] = typeof obj[key] === 'object' && obj[key] !== null ? deepClone(obj[key]) : obj[key]))
//   return cloned
// }

// function deepClone(obj) {
//   if (Array.isArray(obj)) return obj?.map((a) => deepClone(a))
//   return Object.keys(obj).reduce((a, c) => {
//     a[c] = typeof obj[c] === 'object' && obj[c] !== null ? deepClone(obj[c]) : obj[c]
//     return a
//   }, {})
// }

// function deepClone(obj) {
//   if (Array.isArray(obj)) return obj?.map((a) => deepClone(a))
//   return Object.keys(obj).reduce((a, c) => {
//     a[c] = typeof obj[c] === 'object' && obj[c] !== null ? deepClone(obj[c]) : obj[c]
//     return a
//   }, {})
// }

const old = {
  details: [
    {
      detail: {
        name: {
          firstName: 'kandarp',
          lastName: 'dangi',
        },
      },
    },
    {
      name: 'naruto',
    },
    {
      name: '',
    },
  ],
  country: 'india',
}

const newO = deepClone(old)
console.log(newO)
newO.country = 'dangi'
newO.details[0].detail.name.firstName = 'kandarp dangi'
delete newO.details[0].detail.name.lastName

console.log(newO)
console.log(old)

const dd = {
  Name: 'sName',
  ProjectType: 'eProjectType',
  ProjectStatus: 'eProjectStatus',
  ProjectTechnologies: 'projectTechnologies',
  Cost: 'sCost',
  TimeLineDays: 'nTimeLineDays',
  StartDate: 'dStartDate',
  EndDate: 'dEndDate',
  Symbol: 'sSymbol',
  CurrencyName: 'sCurrencyName',
  projectIndicator_RemainingMinute: 'projectIndicator_nRemainingMinute',
  projectIndicator_RemainingCost: 'projectIndicator_nRemainingCost',
  projectIndicator_NonBillableMinute: 'projectIndicator_nNonBillableMinute',
  projectIndicator_NonBillableCost: 'projectIndicator_nNonBillableCost',
  TotalCr: 'total_cr',
  cr_total_RemainingMinute: 'cr_total_nRemainingMinute',
  cr_total_RemainingCost: 'cr_total_nRemainingCost',
  cr_total_NonBillableMinute: 'cr_total_nNonBillableMinute',
  cr_total_NonBillableCost: 'cr_total_nNonBillableCost',
  OnlyCr: 'only_cr',
}
let dnne = []
for (const key in dd) {
  dnne.push({ label: key, value: key, isSelected: true })
}
dnne
