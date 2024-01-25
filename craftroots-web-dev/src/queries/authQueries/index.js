export const CreateCustomer = {
  mutation: `mutation createCustomer($firstname: String!, $lastname: String!, $email:String!, $password: String!, $mobilenumber: String!) {
        createCustomer(
          input: {
            firstname: $firstname
            lastname: $lastname
            email: $email
            password: $password
            mobilenumber:$mobilenumber
          }
        ) {
          customer {
            id
            email
            firstname
            lastname
            mobilenumber
          }
          confirmation_required
          message
        }
      }`,
}

export const MutationSignIn = {
  mutation: `mutation signIn($email: String!, $password: String!) {
      generateCustomerToken(
        email: $email
        password: $password
      ) {
        token
      }
    }`,
}

export const AccountConfirmationLink = {
  mutation: `mutation accountConfirmation($email: String!){
    accountConfirmationLink(
      email: $email
    ) {
      message
      success
    }
  }`,
}

export const AccountConfirmWithToken = {
  mutation: `mutation accountConfirmWithToken($id: Int!, $key:String!){
    accountConfirmation(id: $id, key: $key) {
      message
      success
      token
    }
  }`,
}

export const ForgetPassword = {
  mutation: `mutation forgetPassword($email: String!){
    requestPasswordResetEmail(email: $email){
      message
      success
    }
  }`,
}

export const ResetPassword = {
  mutation: `mutation resetPassword($email: String!,$resetPasswordToken: String!, $newPassword: String! ){
    resetPassword(
      email: $email
      resetPasswordToken: $resetPasswordToken
      newPassword: $newPassword
    ){
      message
      success
    }
  }`,
}

export const UserLoginTracking = {
  mutation: `mutation UserLoginTracking{
    updateUserLoginTracking {
      success
    }
  }`,
}

export const userSeenMessage = {
  query: `query{
    hasUserSeenMessage
  }
  `,
}
