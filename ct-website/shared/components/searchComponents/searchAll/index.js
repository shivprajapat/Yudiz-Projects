import PropTypes from 'prop-types'
import { Col, Row } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import { allRoutes } from '@shared/constants/allRoutes'

const ArticleSkeleton = dynamic(() => import('@shared/components/skeleton/components/articleSkeleton'), { ssr: false })
const SearchCard = dynamic(() => import('@shared/components/searchComponents/searchCard'), { loading: () => <ArticleSkeleton type="t" /> })
const ArticleSmall = dynamic(() => import('@shared/components/article/articleSmall'), { loading: () => <ArticleSkeleton type="s" /> })
const NoData = dynamic(() => import('@shared/components/noData'), { ssr: false })

function SearchAll({ players, series, team, news, video, type }) {
  const router = useRouter()

  return (
    <>
      {players && players?.aResults?.length !== 0 && (
        <>
          <h4 className="text-uppercase">
            <Trans i18nKey="common:Players" />
          </h4>
          <Row className="mb-2 mb-sm-1">
            {players?.aResults?.map((p) => {
              return (
                <Col id={p._id} key={p._id} md={6}>
                  <SearchCard data={p} />
                </Col>
              )
            })}
          </Row>
          {players?.aResults?.length === 4 && (
            <div className="text-center theme-text">
              <Link
                href={{
                  pathname: allRoutes.searchPlayer,
                  query: { q: router?.query?.q }
                }}
                prefetch={false}
              >
                <a className="theme-btn small-btn mb-3">
                  <Trans i18nKey="common:More" /> <Trans i18nKey="common:Players" /> {'>'}
                </a>
              </Link>
            </div>
          )}
        </>
      )}
      {series && series?.aResults?.length !== 0 && (
        <>
          <h4 className="text-uppercase">
            <Trans i18nKey="common:Series" />
          </h4>
          <Row className="mb-2 mb-sm-1">
            {series?.aResults?.map((s) => {
              return (
                <Col id={s._id} key={s._id} md={6}>
                  <SearchCard data={s} />
                </Col>
              )
            })}
          </Row>
          {series?.aResults?.length === 4 && (
            <div className="text-center theme-text">
              <Link
                href={{
                  pathname: allRoutes.searchSeries,
                  query: { q: router?.query?.q }
                }}
                prefetch={false}
              >
                <a className="theme-btn small-btn mb-3">
                  <Trans i18nKey="common:More" /> <Trans i18nKey="common:Series" /> {'>'}
                </a>
              </Link>
            </div>
          )}
        </>
      )}
      {team && team?.aResults?.length !== 0 && (
        <>
          <h4 className="text-uppercase">
            <Trans i18nKey="common:Teams" />
          </h4>
          <Row className="mb-2 mb-sm-1">
            {team?.aResults?.map((t) => {
              return (
                <Col id={t._id} key={t._id} md={6}>
                  <SearchCard data={t} />
                </Col>
              )
            })}
          </Row>
          {team?.aResults?.length === 4 && (
            <div className="text-center theme-text">
              <Link
                href={{
                  pathname: allRoutes.searchTeam,
                  query: { q: router?.query?.q }
                }}
                prefetch={false}
              >
                <a className="theme-btn small-btn mb-3">
                  <Trans i18nKey="common:More" /> <Trans i18nKey="common:Teams" /> {'>'}
                </a>
              </Link>
            </div>
          )}
        </>
      )}
      {news && news?.aResults?.length !== 0 && (
        <>
          <h4 className="text-uppercase">
            <Trans i18nKey="common:News" />
          </h4>
          {news?.aResults?.map((n) => {
            return <ArticleSmall key={n._id} isLarge={true} data={n} />
          })}
          {news?.aResults?.length === 4 && (
            <div className="text-center theme-text">
              <Link
                href={{
                  pathname: allRoutes.searchNews,
                  query: { q: router?.query?.q }
                }}
                prefetch={false}
              >
                <a className="theme-btn small-btn mt-3 mb-3">
                  <Trans i18nKey="common:More" /> <Trans i18nKey="common:News" /> {'>'}
                </a>
              </Link>
            </div>
          )}
        </>
      )}
      {video && video?.aResults?.length !== 0 && (
        <>
          <h4 className="text-uppercase">
            <Trans i18nKey="common:Videos" />
          </h4>
          {video?.aResults?.map((v) => {
            return <ArticleSmall isVideo key={v._id} isLarge={true} data={v} />
          })}
          {video?.aResults?.length === 4 && (
            <div className="text-center theme-text">
              <Link
                href={{
                  pathname: allRoutes.searchVideo,
                  query: { q: router?.query?.q }
                }}
                prefetch={false}
              >
                <a className="theme-btn small-btn mt-3 mb-3">
                  <Trans i18nKey="common:More" /> <Trans i18nKey="common:Videos" /> {'>'}
                </a>
              </Link>
            </div>
          )}
        </>
      )}
      {!players?.aResults?.length &&
        !series?.aResults?.length &&
        !team?.aResults?.length &&
        !news?.aResults?.length &&
        !video?.aResults?.length && <NoData />}
    </>
  )
}
SearchAll.propTypes = {
  players: PropTypes.object,
  series: PropTypes.object,
  team: PropTypes.object,
  news: PropTypes.object,
  video: PropTypes.object,
  type: PropTypes.string
}
export default SearchAll
