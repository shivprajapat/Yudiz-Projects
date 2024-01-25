export const CHILDREN_FIELDS_FRAGMENT = `
  id
  level
  name
  path
  url_path
  url_key
  image
  description
`
export const NAVIGATION_FRAGMENT = `
  children {
    children_count
    id
    include_in_menu
    name
    position
    url_path
    url_suffix
    children {
      ${CHILDREN_FIELDS_FRAGMENT}
      children {
        ${CHILDREN_FIELDS_FRAGMENT}
        children {
          ${CHILDREN_FIELDS_FRAGMENT}
        }
      }
    }
  }
`
export const NavigationMenu = {
  query: `query categoryById($id: Int!){
    category(id: $id){
      id
      name
      ${NAVIGATION_FRAGMENT}
      include_in_menu
      url_path
      url_suffix
    }
  }
  `,
  fetchPolicy: 'cache-first',
}

export const StoreHeaderDetails = {
  query: `query storeHeaderDetails($identifiers:[String]!){
    cmsBlocks(identifiers: $identifiers) {
      items {
        content
        identifier
        title
     }
    }
  }
`,
}
