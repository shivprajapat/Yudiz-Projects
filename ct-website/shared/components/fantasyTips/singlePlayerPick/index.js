import React from 'react'
import PropTypes from 'prop-types'
import { Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import playerImg from '@assets/images/placeholder/player-placeholder.jpg'
import Trans from 'next-translate/Trans'

const MyImage = dynamic(() => import('@shared/components/myImage'))
export default function SinglePlayerPick({ styles, data, type, playerData }) {
  return (
    <Col md={data?.sDescription ? 12 : 6}>
      <div className={`${styles.item} d-flex flex-column flex-sm-row align-items-center align-items-sm-center`}>
        <div className={`${styles.imgBlock} flex-shrink-0 me-sm-3 text-center`}>
          <MyImage src={playerImg} alt="user" placeholder="blur" layout="responsive" width="40" height="40" />
          <div className={`${styles.point} text-light bg-dark rounded-pill`}>
            {data?.oPlayerFan?.nRating}
          </div>
          {type === 'captains' && (
            <div className={`${styles.tag} text-light bg-primary rounded-circle small-text`}>
              {data?.eType === 'v' ? <Trans i18nKey="common:VC" /> : <Trans i18nKey="common:C" />}
            </div>
          )}
        </div>
        <div className="text-center text-sm-start">
          <p className="mb-1 mt-2 mt-sm-0">
            <span className={`font-bold me-2 ${!data?.sDescription && 'd-block'}`}>{data?.oPlayerFan?.oPlayer?.sFirstName}</span>{' '}
            <span className="text-secondary">
              {data?.oPlayerFan?.oTeam?.sAbbr && data?.oPlayerFan?.oTeam?.sAbbr + ' | '} {data?.oPlayerFan?.oPlayer?.sPlayingRole.toUpperCase()}
            </span>
          </p>
          {data?.sDescription && <p className="mb-0 text-secondary">{data?.sDescription}</p>}
        </div>
      </div>
    </Col>
  )
}

SinglePlayerPick.propTypes = {
  styles: PropTypes.any,
  data: PropTypes.object,
  type: PropTypes.string,
  playerData: PropTypes.array
}
