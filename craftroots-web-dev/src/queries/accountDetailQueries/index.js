export const GetAccountDetails = {
  query: `query accountDetails{
        customer {
            id
            email
            firstname
            lastname
            mobilenumber
            is_subscribed
            default_billing
            default_shipping
            dob
          addresses {
                id
                firstname
                lastname
                street
                city
                region {
                    region_code
                    region
                }
                postcode
                country_code
                telephone
                company
                default_billing
            }
            wishlist {
                items_count
            }
            compare_list {
                item_count
            }
        }
      }
      `,
  fetchPolicy: 'no-cache',
}

export const ChangeUserPassword = {
  mutation: `mutation MutationChangeUserPassword($currentPassword: String!, $newPassword: String!) {
    changeCustomerPassword(
        currentPassword: $currentPassword, newPassword: $newPassword
        ) {
        message
        success
        }
      }`,
}

export const ChangeUserInformation = {
  mutation: `mutation ChangeUserInformation($firstname: String, $lastname: String, $mobilenumber: String){
    updateCustomer(
      input: { firstname: $firstname, lastname: $lastname, mobilenumber: $mobilenumber }
    ) {
      customer {
        email
        firstname
        lastname
        mobilenumber
      }
    }
  }
  `,
  fetchPolicy: 'no-cache',
}

export const ChangeUserEmailInformation = {
  mutation: `mutation ChangeUserEmailInformation($email: String){
    updateCustomerEmails(email: $email) {
      customer {
        email
      }
    }
  }
  `,
  fetchPolicy: 'no-cache',
}

export const StoreCreditData = {
  mutation: `query StoredCreditData{
        customer {
        firstname
        lastname
        suffix
        email
        storecredit_credit {
            balance_id
            website_id
            customer_id
            balance_amount
        }
        storecredit_all_credit {
            balance_id
            website_id
            customer_id
            balance_amount
        }
        storecredit_history_credit {
            history_id
            customer_id
            creditmemo_id
            order_id
            website_id
            type
            change_amount
            balance_amount
            comment_content
            created_time
            updated_time
        }
        }
        }
    
  `,
  fetchPolicy: 'no-cache',
}
