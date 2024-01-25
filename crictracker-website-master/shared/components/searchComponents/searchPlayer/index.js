import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { Col, Row } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import { GET_SEARCH_PLAYER } from '@graphql/search/search.query'
import { isBottomReached } from '@shared/utils'

const ArticleSkeleton = dynamic(() => import('@shared/components/skeleton/components/articleSkeleton'), { ssr: false })
const NoData = dynamic(() => import('@shared/components/noData'), { ssr: false })
const SearchCard = dynamic(() => import('../searchCard'), { loading: () => <ArticleSkeleton type="t" /> })

function SearchPlayer({ players }) {
  const router = useRouter()
  const [data, setData] = useState(players?.aResults || [])
  const [loading, setLoading] = useState(false)
  const payload = useRef({ nLimit: 10, nSkip: 1, sSearch: router?.query?.q, sSortBy: 'dCreated', nOrder: -1 })
  const isLoading = useRef(false)
  const [getPlayer, { data: playerData }] = useLazyQuery(GET_SEARCH_PLAYER, { variables: { input: payload.current } })

  const latestPlayer = useRef(playerData?.getPlayerSearch?.aResults?.length || players?.aResults?.length)

  useEffect(() => {
    isLoading.current = false
    setLoading(false)
    isBottomReached(data[data.length - 1]?._id, isReached)
  }, [data])

  useEffect(() => {
    if (playerData?.getPlayerSearch?.aResults) {
      setData([...data, ...playerData.getPlayerSearch.aResults])
      latestPlayer.current = playerData?.getPlayerSearch?.aResults?.length
    }
  }, [playerData])

  function isReached(reach) {
    if (reach && latestPlayer.current === payload.current.nLimit && !isLoading.current) {
      isLoading.current = true
      setLoading(true)
      payload.current.nSkip += 1
      getPlayer()
    }
  }

  return (
    <>
      <h4 className="text-uppercase">
        <Trans i18nKey="common:Players" />
      </h4>
      <Row className="mb-2 mb-sm-1">
        {data.map((s) => {
          return (
            <Col id={s._id} key={s._id} md={6}>
              <SearchCard data={s} />
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
SearchPlayer.propTypes = {
  players: PropTypes.object
}
export default SearchPlayer
