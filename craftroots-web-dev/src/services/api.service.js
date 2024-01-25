import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  from,
  gql,
} from '@apollo/client'
import { getCookie, isLoggedIn } from '@/helper'
import { GRAPHQL_ERROR_MESSAGES, STORAGE_KEYS } from '@/helper/constant'
import { createCart } from '@/helper/product-helper'

const errorLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const { errors } = response
    if (errors) {
      // Handle GraphQL errors
      errors.forEach((error) => {
        const errorMessage = error.message.toLowerCase()
        const cartIdErrorRegEx = new RegExp(
          `${GRAPHQL_ERROR_MESSAGES.cartNotActive}|${GRAPHQL_ERROR_MESSAGES.useCannotPerformOperationsOnCart}|${GRAPHQL_ERROR_MESSAGES.couldNotFindCart}`,
          'i'
        )
        // Perform specific actions based on the error type
        if (error.extensions.code === 'UNAUTHORIZED') {
          /* Redirect to login page or display unauthorized message
          Example: navigate('/login'); */
        } else if (
          errorMessage.includes(
            GRAPHQL_ERROR_MESSAGES.accountNotConfirmed.toLowerCase()
          ) &&
          typeof window !== 'undefined'
        ) {
          dispatchEvent(
            new CustomEvent('gqlerror', {
              detail: { message: '' },
            })
          )
        } else if (
          cartIdErrorRegEx.test(errorMessage) &&
          typeof window !== 'undefined'
        ) {
          localStorage.removeItem(STORAGE_KEYS.cartId)
          createCart()
        } else if (typeof window !== 'undefined') {
          // Display generic error message
          dispatchEvent(
            new CustomEvent('gqlerror', {
              detail: { error, message: 'Something went wrong' },
            })
          )
        }
      })
    }

    return response
  })
})
const getAuthToken = () => {
  if (isLoggedIn()) {
    return getCookie(STORAGE_KEYS.token) || ''
  } else {
    return ''
  }
}

const authLink = new ApolloLink((operation, forward) => {
  const authToken = getAuthToken()
  if (authToken) {
    operation.setContext(({ headers }) => ({
      headers: {
        ...headers,
        authorization: `Bearer ${authToken}`,
      },
    }))
  }
  return forward(operation)
})
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_BACKEND_URL,
  // credentials: 'include',
  // mode: 'cors'
})

const graphqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authLink, errorLink, httpLink]),
})
export const request = async (options) => {
  const optionQuery = options?.query
    ? {
      query: gql`
          ${options.query}
        `,
    }
    : {}
  const queryOptions = { ...options, ...optionQuery }

  if (options.query) {
    // GraphQL request
    const response = await graphqlClient.query(queryOptions)
    return response.data
  } else if (options.mutation) {
    const response = await graphqlClient.mutate({
      ...queryOptions,
      mutation: gql`
        ${queryOptions.mutation}
      `,
    })
    return response.data
  } else {
    try {
      const response = await fetch(options)
      if (!response.ok && typeof window !== 'undefined') {
        console.log('API error', response)
        dispatchEvent(
          new CustomEvent('gqlerror', {
            detail: { error: true, message: 'Something went wrong' },
          })
        )
      }
      const contentType = response.headers.get('content-type')

      if (!contentType) {
        return null
      }
      const isJSON = contentType.startsWith('application/json')

      if (isJSON) {
        return await response.json()
      } else {
        return await response.text()
      }
    } catch (error) {
      console.log('error', error)
    }
  }
}
