import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

const PlayerCardAMP = dynamic(() => import('@shared-components/amp/playerCardAMP'))

const TopPlayerRankingsAMP = ({ data, subPagesURLS }) => {
  return (
    <>
      <style jsx amp-custom>{`
       .scroll-list{margin:0 -12px 12px;overflow:auto}.scroll-list>div{width:25%;padding:0 12px;min-width:240px}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      <div className="flex-nowrap scroll-list d-flex">
        {data?.map((player) => {
          return (
            <div className="col-xl-3" key={player._id}>
              <PlayerCardAMP subPagesURLS={subPagesURLS} data={player} />
            </div>
          )
        })}
      </div>
    </>
  )
}

TopPlayerRankingsAMP.propTypes = {
  data: PropTypes.array,
  subPagesURLS: PropTypes.object
}
export default TopPlayerRankingsAMP
