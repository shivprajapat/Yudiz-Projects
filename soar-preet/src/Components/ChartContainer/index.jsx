import React from 'react'
import PropTypes from 'prop-types'

const ChartContainer = ({ children, firstTitle, secondTitle, thirdTitle }) => {
  return (
    <div className={`bg-lightBlue  w-full h-full  relative transition-all duration-500 scale-100`}>
      <div className='relative p-2.5 mb-2.5 bg-darkGrey flex  justify-between'>
        <h3 className='leading-[16.8px] m-0 text-grey text-sm font-bold'>{firstTitle}</h3>
        <h3 className='leading-[16.8px] m-0 text-grey text-sm font-bold'>{secondTitle}</h3>
        <h3 className='leading-[16.8px] m-0 text-grey text-sm font-bold'>{thirdTitle}</h3>
      </div>
      {children}
    </div>
  )
}

ChartContainer.propTypes = {
  children: PropTypes.node
}
export default ChartContainer
