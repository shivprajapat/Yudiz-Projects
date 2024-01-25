import React from 'react'
import PropTypes from 'prop-types'
import { Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import Trans from 'next-translate/Trans'

const PlayerImg = dynamic(() => import('@shared/components/playerImg'))

export default function SinglePlayerPick({ styles, data, type, playerData, playerTeam }) {
  return (
    <Col md={data?.sDescription ? 12 : 6}>
      <div className={`${styles.item} p-3 d-flex flex-column flex-sm-row align-items-center align-items-sm-center br-sm`}>
        <div className={`${styles.imgBlock} position-relative flex-shrink-0 me-sm-3 text-center`}>
          <PlayerImg
            head={data?.oPlayerFan?.oPlayer?.oImg}
            jersey={playerTeam[data?.oPlayerFan?.oTeam?._id]?.oJersey}
            enableBg
          />
          <div className={`${styles.point} mt-n2 text-light bg-dark rounded-pill position-relative`}>
            {data?.oPlayerFan?.nRating}
          </div>
          {type === 'captains' && (
            <div className={`${styles.tag} position-absolute rounded-circle small-text`}>
              {data?.eType === 'v' ? <Trans i18nKey="common:VC" /> : <Trans i18nKey="common:C" />}
            </div>
          )}
        </div>
        <div className="text-center text-sm-start">
          <p className="mb-1 mt-2 mt-sm-0">
            <span className={`fw-bold me-2 ${!data?.sDescription && 'd-block'}`}>{data?.oPlayerFan?.oPlayer?.sFirstName}</span>{' '}
            <span className={`${styles.info}`}>
              {data?.oPlayerFan?.oTeam?.sAbbr && data?.oPlayerFan?.oTeam?.sAbbr + ' | '} {data?.oPlayerFan?.oPlayer?.sPlayingRole?.toUpperCase()}
            </span>
          </p>
          {data?.sDescription && <p className={`${styles.info} mb-0`}>{data?.sDescription}</p>}
        </div>
      </div>
    </Col>
  )
}

SinglePlayerPick.propTypes = {
  styles: PropTypes.any,
  data: PropTypes.object,
  playerTeam: PropTypes.object,
  type: PropTypes.string,
  playerData: PropTypes.array
}
