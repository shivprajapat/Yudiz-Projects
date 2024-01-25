export const CmsPage = {
  query: `query CmsPage($identifier:String!){
    cmsPage(identifier: $identifier) {
      title
      url_key
      content_heading
      content
      page_layout
      meta_title
      meta_keywords
      meta_description
    }
  }
  `,
}
