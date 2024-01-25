import PropTypes from 'prop-types'

import useMlib from '@shared/hooks/useMlib'

function MLibAd({ id, adUnitName, dimension, placementName, className, width, height, router, pageName, ...rest }) {
  useMlib({
    adUnitName: adUnitName,
    placementName: placementName,
    id: id,
    height: height,
    width: width,
    router: router,
    pageName: pageName
  })

  return (
    <div
      className={`${className || ''} text-center`}
      id={id}
    // {...rest}
    />
  )
}

MLibAd.propTypes = {
  id: PropTypes.string.isRequired,
  adUnitName: PropTypes.string,
  dimension: PropTypes.array.isRequired,
  placementName: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  className: PropTypes.string,
  pageName: PropTypes.string,
  router: PropTypes.object
}
export default MLibAd
