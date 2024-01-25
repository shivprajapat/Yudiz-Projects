import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { useLazyQuery } from '@apollo/client'
import { Row, Col, Button } from 'react-bootstrap'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import { isBottomReached, debounce } from '@utils'
import SearchFilter from '@shared/components/fixtureContent/searchFilter'
import AlphabetSlider from '@shared/components/alphabetSlider'
import formStyles from '@assets/scss/components/form.module.scss'
import { LIST_AUTHORS } from '@graphql/author/author.query'
import { authorListLoader } from '@shared/libs/allLoader'
import Error from '@shared/components/error'
import { allRoutes } from '@shared/constants/allRoutes'
import { CloseIcon } from '@shared/components/ctIcons'

const NoData = dynamic(() => import('@noData'), { ssr: false })
const AuthorListCard = dynamic(() => import('./authorListCard'), { loading: () => authorListLoader(2) })

function AuthorList({ list }) {
  const { t } = useTranslation()
  const router = useRouter()
  const [authorList, setAuthorList] = useState(list?.aResults)
  const payloads = useRef({ nLimit: 18, nSkip: 2, sSearch: router?.query?.search || '', sAlphaSearch: router?.query?.alpha || '' })
  const loading = useRef(false)
  const isReachedBottom = useRef(false)

  const [getAuthorList, { data: newAuthorData, loading: isLoading }] = useLazyQuery(LIST_AUTHORS)
  const latestAuthorList = useRef(newAuthorData?.listSeriesArchive?.aResults?.length || list?.aResults?.length)

  const handleSearch = debounce((data) => {
    payloads.current = { ...payloads.current, sSearch: data, nSkip: 1 }
    if (router?.query?.alpha && data.trim()?.length) {
      router.push({
        query: { search: data.trim(), alpha: router?.query?.alpha }
      }, undefined, { shallow: true })
    } else if (data.trim()?.length) {
      router.push({
        query: { search: data.trim() }
      }, undefined, { shallow: true })
    } else if (router.query.alpha) {
      router.replace({ pathname: allRoutes.authors, query: { alpha: router.query.alpha } }, undefined, { shallow: true })
    } else {
      router.replace({ pathname: allRoutes.authors }, undefined, { shallow: true })
    }
  })

  const handleAtoZFilter = debounce((alpha) => {
    if (router?.query?.search) {
      router.push({
        query: { search: router?.query?.search, alpha: alpha }
      })
    } else {
      router.push({
        query: { alpha: alpha }
      })
    }
  })

  useEffect(() => {
    if (router?.query) {
      payloads.current = { ...payloads.current, sAlphaSearch: router?.query?.alpha || '', sSearch: router?.query?.search || '', nSkip: 1 }
      getAuthorList({ variables: { input: { ...payloads.current } } })
    }
  }, [router?.query])

  useEffect(() => {
    loading.current = false
    isBottomReached(authorList[authorList.length - 1]?._id, isReached)
  }, [authorList])

  useEffect(() => {
    if (isReachedBottom.current && newAuthorData) {
      setAuthorList([...authorList, ...newAuthorData?.listAuthors?.aResults])
      loading.current = false
      isReachedBottom.current = false
    } else if (!loading.current && newAuthorData) {
      setAuthorList(newAuthorData?.listAuthors?.aResults)
    }
    latestAuthorList.current = newAuthorData?.listAuthors?.aResults?.length || list?.aResults?.length
  }, [newAuthorData])

  function isReached(reach) {
    if (reach && !loading.current && (latestAuthorList.current >= payloads.current.nLimit)) {
      loading.current = true
      isReachedBottom.current = true
      payloads.current = ({ ...payloads.current, nSkip: payloads.current.nSkip + 1 })
      getAuthorList({ variables: { input: payloads.current } })
    }
  }

  const clearFilter = () => {
    if (router?.query?.search) {
      router.replace({ pathname: allRoutes.authors, query: { search: router?.query?.search } }, undefined, { shallow: true })
    } else {
      router.replace({ pathname: allRoutes.authors }, undefined, { shallow: true })
    }
  }

  return (
    <>
      <Row className='d-flex align-items-center justify-content-between'>
        <Col md={4} className="pb-0">
          <SearchFilter handleSearch={handleSearch} formStyles={formStyles} placeholder={t('common:SearchAuthor')} />
        </Col>
        <Col md={8} className="pb-0">
          <div className={`${styles.filters} d-flex align-items-start`}>
            <div className={`${styles.slider} ${!router?.query?.alpha && 'w-100'}`}>
              <AlphabetSlider selectedAlphabet={router?.query?.alpha} handleSearch={handleAtoZFilter} />
            </div>
            {
              router?.query?.alpha && (
                <Button variant="link" className={`${styles.closeBtn} light-bg mt-1 ms-2 d-flex align-items-center justify-content-center rounded-circle`} onClick={clearFilter}>
                  <CloseIcon />
                </Button>
              )
            }
          </div>
        </Col>
      </Row>
      <Row>
        {authorList?.map((authorData) => (
          <Col id={authorData?._id} key={authorData?._id} xl={4} md={6}>
            <AuthorListCard data={authorData} />
          </Col>
        ))}
        {authorList?.length === 0 && <NoData />}
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
