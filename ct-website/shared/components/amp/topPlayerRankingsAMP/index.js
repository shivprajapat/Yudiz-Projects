import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

const PlayerCardAMP = dynamic(() => import('@shared-components/amp/playerCardAMP'))

const TopPlayerRankingsAMP = ({ data }) => {
  return (
    <>
      <style jsx amp-custom>{`
       .scroll-list{margin:0 -12px 12px;display:flex;display:-webkit-flex;overflow:auto}.scroll-list>div{width:25%;padding:0 12px;min-width:210px}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      <div className="flex-nowrap scroll-list">
        {data?.map((player) => {
          return (
            <div className="col-xl-3" key={player._id}>
              <PlayerCardAMP data={player} />
            </div>
          )
        })}
      </div>
    </>
  )
}

TopPlayerRankingsAMP.propTypes = {
  data: PropTypes.array
}
export default TopPlayerRankingsAMP
