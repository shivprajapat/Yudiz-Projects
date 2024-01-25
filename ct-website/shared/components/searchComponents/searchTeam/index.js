import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { Col, Row } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import { GET_SEARCH_TEAM } from '@graphql/search/search.query'
import { isBottomReached } from '@shared/utils'

const ArticleSkeleton = dynamic(() => import('@shared/components/skeleton/components/articleSkeleton'), { ssr: false })
const NoData = dynamic(() => import('@shared/components/noData'), { ssr: false })
const SearchCard = dynamic(() => import('../searchCard'), { loading: () => <ArticleSkeleton type="t" /> })

function SearchTeam({ team }) {
  const router = useRouter()
  const [data, setData] = useState(team?.aResults || [])
  const payload = useRef({ nLimit: 10, nSkip: 1, sSearch: router?.query?.q, sSortBy: 'dCreated', nOrder: -1 })
  const [loading, setLoading] = useState(false)
  const isLoading = useRef(false)
  const [getTeam, { data: teamData }] = useLazyQuery(GET_SEARCH_TEAM, { variables: { input: payload.current } })

  const latestSeries = useRef(teamData?.getTeamSearch?.aResults?.length || team?.aResults?.length)

  useEffect(() => {
    isLoading.current = false
    setLoading(false)
    isBottomReached(data[data.length - 1]?._id, isReached)
  }, [data])

  useEffect(() => {
    if (teamData?.getTeamSearch?.aResults) {
      setData([...data, ...teamData.getTeamSearch.aResults])
      latestSeries.current = teamData?.getTeamSearch?.aResults?.length || team?.aResults?.length
    }
  }, [teamData])

  function isReached(reach) {
    if (reach && latestSeries.current === payload.current.nLimit && !isLoading.current) {
      isLoading.current = true
      setLoading(true)
      payload.current.nSkip += 1
      getTeam()
    }
  }

  return (
    <>
      <h4 className="text-uppercase">
        <Trans i18nKey="common:Teams" />
      </h4>
      <Row className="mb-2 mb-sm-1">
        {data?.map((t) => {
          return (
            <Col id={t._id} key={t._id} md={6}>
              <SearchCard data={t} />
            </Col>
          )
        })}
        {loading && (
          <>
            <Col md={6}>
              <ArticleSkeleton type="t" />
            </Col>
            <Col md={6}>
              <ArticleSkeleton type="t" />
            </Col>
          </>
        )}
      </Row>
      {data?.length === 0 && <NoData />}
    </>
  )
}
SearchTeam.propTypes = {
  team: PropTypes.object
}
export default SearchTeam
