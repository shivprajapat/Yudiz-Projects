import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

const FantasyTipsItems = dynamic(() => import('@shared-components/amp/fantasyTipsItems'))
const NoDataAMP = dynamic(() => import('@shared/components/amp/noDataAMP'))

const SeriesFantasyTipsListAMP = ({ data }) => {
  return (
    <>
    {data?.listSeriesFantasyTipsFront?.map((item, index) => {
      return <FantasyTipsItems key={index} data={item} isSeries/>
    })}
    {data?.listSeriesFantasyTipsFront.length === 0 && <NoDataAMP/>}
    </>
  )
}

SeriesFantasyTipsListAMP.propTypes = {
  data: PropTypes.object
}

export default SeriesFantasyTipsListAMP
