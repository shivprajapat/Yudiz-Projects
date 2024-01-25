import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { useLazyQuery } from '@apollo/client'
import { Row, Col, Button } from 'react-bootstrap'

import { isBottomReached, getStringJoinByDash } from '@utils'
import { LIST_AUTHORS } from '@graphql/author/author.query'
import { authorListLoader } from '@shared/libs/allLoader'
import Error from '@shared/components/error'

const AuthorListCard = dynamic(() => import('./authorListCard'), { loading: () => authorListLoader(2) })

function AuthorList({ list }) {
  const { t } = useTranslation()
  const [startLoadMore, setStartLoadMore] = useState(true)
  const [authorList, setAuthorList] = useState(list?.aResults)
  const loading = useState(false)
  const payloads = useRef({ nLimit: 9, nSkip: 2 })
  const total = useRef(list?.nTotal)
  const [isLoading, setIsLoading] = useState(false)

  const [getAuthorList, { data: newAuthorData }] = useLazyQuery(LIST_AUTHORS, {
    variables: { input: payloads.current }
  })

  function startLoadMoreFlagSet() {
    getAuthorList()
  }

  useEffect(() => {
    if (authorList?.length > 9) {
      setStartLoadMore(false)
    }
    if (authorList?.length > 17) {
      loading.current = false
      setIsLoading(false)
      const lastAuthorListItem = authorList[authorList.length - 1]
      const authorListItemID = lastAuthorListItem?.oSeo?.sSlug || getStringJoinByDash(lastAuthorListItem?.sFName)
      isBottomReached(authorListItemID, isReached)
    }
  }, [authorList])

  useEffect(() => {
    const authorListResponse = newAuthorData?.listAuthors
    const totalAuthors = authorListResponse?.aResults
    if (totalAuthors && totalAuthors.length) {
      setAuthorList([...authorList, ...totalAuthors])
      total.current = authorListResponse.nTotal
    }
  }, [newAuthorData])

  function isReached(reach) {
    if (!loading.current && reach && authorList?.length < total.current) {
      loading.current = true
      setIsLoading(true)
      setPayload()
    }
  }

  function setPayload() {
    payloads.current = { ...payloads.current, nSkip: payloads.current.nSkip + 1 }
    getAuthorList()
  }

  return (
    <>
      <Row>
        {authorList?.map((authorData) => (
          <Col key={authorData._id} xl={4} md={6}>
            <AuthorListCard data={authorData} />
          </Col>
        ))}
        {isLoading && (
          <>
            <Col md="4" sm="6">
              {authorListLoader(1)}
            </Col>
            <Col md="4" sm="6">
              {authorListLoader(1)}
            </Col>
            <Col md="4" sm="6">
              {authorListLoader(1)}
            </Col>
          </>
        )}
      </Row>
      {startLoadMore && (
        <div className="text-center mb-3">
          <Button className="theme-btn" onClick={() => startLoadMoreFlagSet()}>
            {t('common:LoadMore')}
          </Button>
        </div>
      )}
    </>
  )
}

AuthorList.propTypes = {
  list: PropTypes.object
}

AuthorList.defaultProps = {
  list: []
}

export default Error(AuthorList)
