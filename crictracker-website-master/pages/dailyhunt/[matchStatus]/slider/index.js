import PropTypes from 'prop-types'
import Head from 'next/head'

import Error from '@shared/components/error'
import ScoreCard from '@shared/components/scorecardSlider/scorecard'
import style from '@shared/components/scorecardSlider/style.module.scss'
import NoIndexNoFollow from '@shared/components/no-index-follow'
// import Logo from '@assets/images/logo-color.svg'
// import MyImage from '@shared/components/myImage'

function DHFixtureSlider({ upcoming, iSeriesId, matchStatus }) {
  return (
    <>
      <Head>
        <style>{`
          body { background-color: transparent !important; }
          .dh-list .slider-box-dh {border: 1px solid #e4e6eb; border-radius: 4px}
        `}</style>
        <NoIndexNoFollow />
      </Head>
      <div className='container overflow-scroll'>
        {/* <div className='pt-3 d-flex align-items-center justify-content-between'>
          <h4 className='mb-0'>{matchStatus === 'scheduled' ? 'Fixtures' : 'Results'}</h4>
          <p className='m-0 d-flex align-items-center'>Powered by
            <div style={{ width: '100px' }} className="ms-1">
              <MyImage src={Logo} layout="responsive" />
            </div>
          </p>
        </div> */}
        <div className={`${style?.scorecardSlider} border-0 d-flex gap-2 overflow-auto dh-list`}>
          {upcoming?.map((card, index) => {
            return (
              <ScoreCard
                card={card}
                key={card?._id}
                seriesId={iSeriesId}
                className="pe-none slider-box-dh"
                isDailyHuntMode
              />
            )
          })}
        </div>
        {upcoming?.length === 0 && <p className='text-center'>No Data found</p>}
      </div>
    </>
  )
}

DHFixtureSlider.propTypes = {
  iSeriesId: PropTypes.string.isRequired,
  matchStatus: PropTypes.string,
  upcoming: PropTypes.array
}

export default Error(DHFixtureSlider)

function setArrayLength5(data) {
  if (data?.length > 5) {
    data.length = 5
    return data
  } else {
    return data
  }
}

export async function getServerSideProps({ res, params, query, resolvedUrl }) {
  res.setHeader('Cache-Control', 'public, max-age=420')
  try {
    const { iSeriesId } = query
    const { matchStatus } = params

    if (!iSeriesId || !['scheduled', 'completed'].includes(matchStatus)) return { notFound: true }

    const queryGraphql = (await import('@shared-components/queryGraphql')).default
    const { FIXTURES_LIST } = (await import('@graphql/series/fixtures.query'))

    const { data: fixture } = await queryGraphql(FIXTURES_LIST, { input: { iSeriesId, nOrder: 1, sSortBy: 'dStartDate', sStatusStr: matchStatus } })

    const fixtureData = setArrayLength5(fixture?.fetchFixuresData)
    if (fixtureData?.length === 0) {
      return {
        notFound: true
      }
    }
    return { props: { upcoming: fixtureData, iSeriesId, matchStatus } }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const handleApiError = (await import('@shared/utils')).handleApiError
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}
