import React, { Fragment } from 'react'
import { Table } from 'reactstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Loading from '../../../component/SkeletonTable'
import { defaultPlayerRoleImages } from '../../../utils/helper'
import PlayerDetails from '../../../HOC/SportsLeagueList/PlayerDetails'
import { useParams } from 'react-router-dom'
import classNames from 'classnames'

function PlayerInfo (props) {
  const {
    playerData, pointBreakUp, nScoredPoints, loading
  } = props

  const { sportsType } = useParams()

  return (
    <>
      {loading && <Loading Lines={7} series />}
      <div className="player-info">
        <div className="league-header u-header">
          <div className="d-flex align-items-center header-i">
            <button className={document.dir === 'rtl' ? 'btn-link icon-right-arrow' : 'btn-link icon-left-arrow'} onClick={() => props.onBackClick()} />
            <div>
              <h1 className="text-uppercase">{playerData && playerData.sName}</h1>
            </div>
          </div>
        </div>
        <div className="player-detail d-flex align-items-center">
          <div className="p-i">
            <img alt="" className="h-100 w-100 borderRadius" src={defaultPlayerRoleImages(sportsType, playerData?.eRole)} />
          </div>
          <div className="player-d-i d-flex flex-wrap">
            <div className={classNames('item', { 'text-end': document.dir === 'rtl' })}>
              <p><FormattedMessage id="Selected_by" /></p>
              <b>
                {playerData && playerData.nSetBy ? playerData.nSetBy : <FormattedMessage id="Zero" />}
                <FormattedMessage id="Percentage" />
              </b>
            </div>
            <div className="item text-center">
              <p><FormattedMessage id="Points" /></p>
              <b>{nScoredPoints || <FormattedMessage id="Zero" />}</b>
            </div>
            <div className={classNames('item', { 'text-end': document.dir !== 'rtl', 'text-start': document.dir === 'rtl' })}>
              <p><FormattedMessage id="Credits" /></p>
              <b>{playerData && playerData.nFantasyCredit ? playerData.nFantasyCredit : <FormattedMessage id="Zero" />}</b>
            </div>
            <div className={classNames('item', { 'text-end': document.dir === 'rtl' })}>
              <p><FormattedMessage id="C_by" /></p>
              <b>
                {playerData && playerData.nCaptainBy ? playerData.nCaptainBy : <FormattedMessage id="Zero" />}
                <FormattedMessage id="Percentage" />
              </b>
            </div>
            <div className="item text-center">
              <p><FormattedMessage id="VC_by" /></p>
              <b>
                {playerData && playerData.nViceCaptainBy ? playerData.nViceCaptainBy : <FormattedMessage id="Zero" />}
                <FormattedMessage id="Percentage" />
              </b>
            </div>
          </div>
        </div>
        <Table className="player-d-t">
          <thead>
            <tr>
              <th><FormattedMessage id="Events" /></th>
              <th><FormattedMessage id="Actions" /></th>
              <th><FormattedMessage id="Points" /></th>
            </tr>
          </thead>
          <tbody>
            {
              loading
                ? <Loading Lines={7} series />
                : pointBreakUp && pointBreakUp.length && pointBreakUp.length !== 0
                  ? pointBreakUp.map((points) => (
                    <tr key={points._id}>
                      <td>{points && points.sName && points.sName}</td>
                      <td>{points && points.nPoint && points.nPoint >= 0 && points.nScoredPoints >= 0 ? (points.nScoredPoints / points.nPoint) : '-'}</td>
                      <td>
                        {points && points.nScoredPoints && points.nScoredPoints}
                        {' '}
                      </td>
                    </tr>
                  ))
                  : (
                    <tr>
                      <td colSpan="3">
                        <FormattedMessage id="No_pointBreakup_Available" />
                      </td>
                    </tr>
                    )
            }
            <tr>
              <td colSpan="2"><FormattedMessage id="Total" /></td>
              <td className={classNames({ 'text-end': document.dir !== 'rtl', 'text-start': document.dir === 'rtl' })}>{nScoredPoints}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  )
}

PlayerInfo.propTypes = {
  onBackClick: PropTypes.func,
  playerData: PropTypes.shape({
    nViceCaptainBy: PropTypes.number,
    nCaptainBy: PropTypes.number,
    nFantasyCredit: PropTypes.number,
    nSetBy: PropTypes.number,
    eRole: PropTypes.string,
    sName: PropTypes.string
  }),
  match: PropTypes.object,
  pointBreakUp: PropTypes.array,
  nScoredPoints: PropTypes.number,
  loading: PropTypes.bool
}

export default PlayerDetails(PlayerInfo)
