export const storeConfig = {
  query: `query storeConfig {
    storeConfig {
      id
      root_category_id
      base_media_url
      header_logo_src
      copyright
    }
  }
  `,
  fetchPolicy: 'cache-first',
}
