import PropTypes from 'prop-types'
import Head from 'next/head'

import Error from '@shared/components/error'
import Standings from '@shared/components/series/standings'
import NoIndexNoFollow from '@shared/components/no-index-follow'

function DHPointsTable({ roundData, standingData, iSeriesId }) {
  return (
    <>
      <Head>
        <title>Points table</title>
        <style>{`
          body { background-color: transparent !important; }
          table td { background: #e4e6eb !important }
          // table tr {border: 1px solid #e4e6eb}
        `}</style>
        <NoIndexNoFollow />
      </Head>
      <div className='container py-2'>
        <Standings
          round={roundData?.fetchSeriesRounds}
          id={iSeriesId}
          standing={standingData?.fetchSeriesStandings}
          hideSeriesTitle={true}
        />
      </div>
    </>
  )
}

DHPointsTable.propTypes = {
  iSeriesId: PropTypes.string.isRequired,
  roundData: PropTypes.object,
  standingData: PropTypes.object
}

export default Error(DHPointsTable)

export async function getServerSideProps({ res, query, resolvedUrl }) {
  res.setHeader('Cache-Control', 'public, max-age=120, s-maxage=120')
  try {
    const { iSeriesId } = query

    if (!iSeriesId) return { notFound: true }

    const queryGraphql = (await import('@shared-components/queryGraphql')).default
    const { GET_ROUNDS, GET_STANDING_DATA } = (await import('@graphql/series/standings.query'))

    const { data: roundData } = await queryGraphql(GET_ROUNDS, { input: { iSeriesId } })
    const { data: standingData } = await queryGraphql(GET_STANDING_DATA, { input: { iSeriesId, iRoundId: null } })

    return { props: { roundData, standingData, iSeriesId } }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const handleApiError = (await import('@shared/utils')).handleApiError
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}
