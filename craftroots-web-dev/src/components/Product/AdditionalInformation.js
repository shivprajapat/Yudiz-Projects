import React from 'react'
import PropTypes from 'prop-types'

function AdditionalInformation({ additionalInfo }) {
  const additionalInfoData = additionalInfo?.moreInfoProducts?.data

  return (
    additionalInfoData?.length > 0 && (
      <div className="flex gap-4 flex-col w-full">
        {additionalInfoData?.map((data) => (
          <div key={data.label} className="flex justify-between items-center">
            <span className="text-base font-light !text-secondary-100 w-1/2 sm:w-1/3 md:w-1/6 flex items-center justify-between">
              {data.label} <span>:</span>
            </span>
            <span className="text-sm sm:text-base font-light text-grey-900 w-full pl-5">
              {data.value}
            </span>
          </div>
        ))}
      </div>
    )
  )
}

export default AdditionalInformation
AdditionalInformation.propTypes = {
  additionalInfo: PropTypes.object.isRequired,
}
