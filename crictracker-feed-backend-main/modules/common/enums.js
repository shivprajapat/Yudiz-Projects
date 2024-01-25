const enums = {
  eStatus: {
    value: ['a', 'i', 'd'],
    description: { a: 'active', i: 'inactive', d: 'deleted' },
    default: 'a'
  },
  eAdminType: {
    value: ['SUPER', 'SUB'],
    description: { SUPER: 'Super Admin', SUB: 'Sub Admin' }
  }
}

module.exports = enums
