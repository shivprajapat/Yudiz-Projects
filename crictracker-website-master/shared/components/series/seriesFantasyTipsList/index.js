import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

const FantasyTipsItems = dynamic(() => import('@shared/components/fantasyTipsItems'))
const NoData = dynamic(() => import('@shared/components/noData'))

const SeriesFantasyTipsList = ({ data }) => {
  return (
    <>
    {data?.listSeriesFantasyTipsFront?.map((item, index) => {
      return <FantasyTipsItems key={index} data={item} isSeries/>
    })}
    {data?.listSeriesFantasyTipsFront.length === 0 && <NoData/>}
    </>
  )
}

SeriesFantasyTipsList.propTypes = {
  data: PropTypes.object
}

export default SeriesFantasyTipsList
