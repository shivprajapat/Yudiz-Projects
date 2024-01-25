export const getMatchFormat = (key) => {
  switch (key) {
    case 'firstclass':
      return 'fc'
    case 'lista':
      return 'list a'
    default:
      return key
  }
}
