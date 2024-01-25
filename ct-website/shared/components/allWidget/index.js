import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import dynamic from 'next/dynamic'

import { HOME_PAGE_WIDGET } from '@graphql/home/home.query'

const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })
const CricSpecial = dynamic(() => import('@shared-components/cricSpecial'), {
  loading: () => (
    <div className='mb-3'>
      <Skeleton className={'mb-2'} width={'50px'} /> <Skeleton height={'200px'} radius={'10px'} />
      <Skeleton height={'15px'} width={'30px'} className="mt-2" /><Skeleton height={'15px'} className="mt-2" />
      <Skeleton height={'15px'} className="mt-2" />
    </div>
  )
})
const RankingTab = dynamic(() => import('@shared-components/rankingTab'), {
  loading: () => (
    <>
      <Skeleton width={'50%'} height={'20px'} />
      <div className='bg-white rounded p-3 mt-3'>
        <div className='d-flex mb-3'>
          <Skeleton height={'30px'} className={'mx-1'} radius={'10px'} />
          <Skeleton height={'30px'} className={'mx-1'} radius={'10px'} />
          <Skeleton height={'30px'} className={'mx-1'} radius={'10px'} />
        </div>
        <div className={'d-flex align-items-center '}>
          <Skeleton />
          <Skeleton className={'mx-2'} />
          <Skeleton />
        </div>
        <div className={'d-flex align-items-center mt-2'}>
          <Skeleton />
          <Skeleton className={'mx-2'} />
          <Skeleton />
        </div>
      </div>
    </>
  )
})
const TrendingNews = dynamic(() => import('@shared-components/trendingNews'), {
  loading: () => (
    <>
      <Skeleton width={'150px'} />
      <div className='my-3 d-flex'>
        <div>
          <Skeleton width={'25px '} />
        </div>
        <div className='w-100 ps-2'>
          <Skeleton width={'25px '} />
          <Skeleton className={'mt-1'} />
          <Skeleton width={'50%'} className={'mt-1'} />
          <Skeleton height={'2px '} className={'mt-3'} />
        </div>
      </div>
      <div className='my-3 d-flex'>
        <div>
          <Skeleton width={'25px '} />
        </div>
        <div className='w-100 ps-2'>
          <Skeleton width={'25px '} />
          <Skeleton className={'mt-1'} />
          <Skeleton width={'50%'} className={'mt-1'} />
        </div>
      </div>
    </>
  )
})
const CurrentSeries = dynamic(() => import('@shared-components/widgets/currentSeries'), {
  loading: () => (
    <div className='my-4'>
      <Skeleton width={'150px'} height={'20px'} />
      {[0, 1, 2].map(i => <div key={i} className='bg-white p-3 rounded my-2'> <Skeleton /> </div>)}
    </div>
  )
})
const TopTeams = dynamic(() => import('@shared-components/widgets/topTeams'), {
  loading: () => (
    <>
      <Skeleton width={'150px'} height={'20px'} />
      {[0, 1, 2].map(e => (
        <div key={e} className='d-flex my-2'>
          <div className='bg-white p-3 w-100 me-1 rounded'>
            <Skeleton />
          </div>
          <div className='bg-white p-3 w-100 ms-1 rounded'>
            <Skeleton />
          </div>
        </div>
      ))}
    </>
  )
})
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })

const Components = {
  cricSpecial: CricSpecial,
  ranking: RankingTab,
  trendingNews: TrendingNews,
  currentSeries: CurrentSeries,
  topTeams: TopTeams
}

function AllWidget({ position, index, show, type }) {
  const [getHomeWidgets, { data }] = useLazyQuery(HOME_PAGE_WIDGET)
  const allWidget = data?.getHomeWidgets
  const stringIndex = index?.toString()

  useEffect(() => {
    !type && getHomeWidgets()
  }, [])

  if (allWidget?.length > 0 && show && !type) { // Only for home page
    if (stringIndex) {
      if ((index + 1) > allWidget?.length) return null
      else {
        const Widget = Components[allWidget[index]?.eType]
        return <Widget />
      }
    } else {
      return (
        allWidget?.filter(e => e.sPosition === position).map((e, i) => {
          const Widget = Components[e.eType]
          return (
            <React.Fragment key={e.eType}>
              {(i === 1 && position === 'r') && (
                <Ads
                  id="div-ad-gpt-138639789-16600-Desktop_HP_RightBTF_3--55716-2"
                  adIdDesktop="Crictracker2022_Desktop_HP_RightBTF_300x250"
                  dimensionDesktop={[300, 250]}
                  className="mb-3"
                />
              )}
              <Widget key={e.eType} />
            </React.Fragment>
          )
        })
      )
    }
  } else if (type) { // For others pages
    const Widget = Components[type]
    return <Widget />
  } else return null
}

AllWidget.propTypes = {
  position: PropTypes.string,
  index: PropTypes.number,
  show: PropTypes.bool,
  type: PropTypes.string
}
export default AllWidget
