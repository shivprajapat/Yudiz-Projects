export const CMS_FOOTER_FRAGMENT = `items {
  content
  identifier
  title
}`

export const FooterLink = {
  query: `query cmsFooterLinks($identifiers:[String]!){
    cmsBlocks(identifiers: $identifiers) {
      ${CMS_FOOTER_FRAGMENT}
    }  
  }
`,
  fetchPolicy: 'cache-first',
}

export const NewsLetterSignUp = {
  mutation: `mutation subscribeEmailToNewsletter($email:String!){
    subscribeEmailToNewsletter(email:$email){
      status
    }
  }`,
}

export const AssistanceFormData = {
  mutation: `mutation AssistanceForm($name:String!,$email:String!,$telephone:String!,$message:String!){
    assistanceForm(input: {
      name:$name
      email:$email
      telephone:$telephone
      message:$message
    }) {
      message
      success
    }
  
  }`,
}
