import React from 'react'
import PropTypes from 'prop-types'
import { ApolloClient, ApolloProvider, createHttpLink, from, InMemoryCache, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

import { GRAPHQL_URL, TOAST_TYPE, SUBSCRIPTION_URL } from '../shared/constants'
import { clearCookie } from '@shared/utils'
import { getMainDefinition } from '@apollo/client/utilities'
import { getToken } from '@shared/libs/menu'
// import { history } from 'App'

const apiUrl = GRAPHQL_URL
const subscriptionUrl = SUBSCRIPTION_URL
const httpLink = createHttpLink({
  uri: apiUrl
})

const wsLink = () => {
  return new GraphQLWsLink(createClient({
    url: subscriptionUrl
  })
  )
}

const splitLink = typeof window === 'undefined' ? httpLink : split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink(),
  httpLink
)

class MyApolloProvider extends React.Component {
  constructor(props) {
    super(props)
    this.middleware = setContext(({ operationName }, { headers }) => {
      if (!['GetPreviewArticleFront', 'GetPreviewFantasyArticleFront'].includes(operationName)) {
        const token = getToken()
        return {
          headers: {
            ...headers,
            authorization: token && `${token}`
          }
        }
      }
    })

    this.errorLink = onError(({ graphQLErrors, networkError, operation }) => {
      if (graphQLErrors && operation.operationName !== 'UserLogout') {
        graphQLErrors.forEach(({ message, extensions }) => {
          if (extensions?.code === 'UNAUTHENTICATED') {
            // unauthorized
            clearCookie()
            // history.replace('/')
          }
          this.props.dispatch({
            type: 'SHOW_TOAST',
            payload: {
              message: message,
              type: TOAST_TYPE.Error
            }
          })
        })
      }
      if (networkError) console.error(`[Network error]: ${networkError}`)
    })
    this.graphqlClient = new ApolloClient({
      link: from([this.errorLink, this.middleware, splitLink]),
      defaultOptions: {
        watchQuery: { errorPolicy: 'all' },
        query: { errorPolicy: 'all' },
        mutate: { errorPolicy: 'all' }
      },
      cache: new InMemoryCache(),
      connectToDevTools: true
    })
  }

  render() {
    return <ApolloProvider client={this.graphqlClient}>{this.props.children}</ApolloProvider>
  }
}
MyApolloProvider.propTypes = {
  children: PropTypes.node,
  dispatch: PropTypes.func,
  logout: PropTypes.func
}

export default MyApolloProvider
