import PropTypes from 'prop-types'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import Error from '@shared/components/error'
import NoIndexNoFollow from '@shared/components/no-index-follow'
// import Logo from '@assets/images/logo-color.svg'
// import MyImage from '@shared/components/myImage'

const FixturesItems = dynamic(() => import('@shared/components/series/fixturesItems'))

function DHFixtureList({ upcoming, iSeriesId, matchStatus }) {
  return (
    <>

      <Head>
        <title>{matchStatus === 'scheduled' ? 'Fixtures' : 'Results'}</title>
        <style>{`
          body { background-color: transparent !important; }
          .container .fixture-box-DH {border: 1px solid #e4e6eb}
        `}</style>
        {/* <style></style> */}
        <NoIndexNoFollow />
      </Head>
      <div className='container py-3'>
        {/* <div className='pb-3 d-flex align-items-center justify-content-between'>
          <h4 className='mb-0'>{matchStatus === 'scheduled' ? 'Fixtures' : 'Results'}</h4>
          <p className='m-0 d-flex align-items-center'>Powered by
            <div style={{ width: '100px' }} className="ms-1">
              <MyImage src={Logo} layout="responsive" />
            </div>
          </p>
        </div> */}
        {upcoming?.map((fixture) => {
          return <FixturesItems key={fixture._id} fixture={fixture} className="pe-none fixture-box-DH" isDailyHuntMode />
        })}
        {upcoming?.length === 0 && <p className='text-center'>No Data found</p>}
      </div>
    </>
  )
}

DHFixtureList.propTypes = {
  iSeriesId: PropTypes.string.isRequired,
  matchStatus: PropTypes.string,
  upcoming: PropTypes.array
}

export default Error(DHFixtureList)

export async function getServerSideProps({ res, params, query, resolvedUrl }) {
  res.setHeader('Cache-Control', 'public, max-age=420')
  try {
    const { iSeriesId } = query
    const { matchStatus } = params

    if (!iSeriesId || !['scheduled', 'completed'].includes(matchStatus)) return { notFound: true }

    const queryGraphql = (await import('@shared-components/queryGraphql')).default
    const { FIXTURES_LIST } = (await import('@graphql/series/fixtures.query'))

    const { data: fixture } = await queryGraphql(FIXTURES_LIST, { input: { iSeriesId, nOrder: 1, sSortBy: 'dStartDate', sStatusStr: matchStatus } })
    return { props: { upcoming: fixture?.fetchFixuresData, iSeriesId, matchStatus } }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const handleApiError = (await import('@shared/utils')).handleApiError
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}
