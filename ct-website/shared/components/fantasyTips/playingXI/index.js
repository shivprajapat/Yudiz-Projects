import React from 'react'
import PropTypes from 'prop-types'
import styles from './style.module.scss'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import { arraySortByOrder } from '@shared/utils'

const PlayingXI = ({ fantasystyles, probableXI }) => {
  const order = ['bat', 'all', 'wk', 'wkbat', 'bowl']
  const teamOnePlayer = arraySortByOrder({ data: probableXI?.oTeam1?.aPlayers, order, key: 'sPlayingRole' })
  const teamTwoPlayer = arraySortByOrder({ data: probableXI?.oTeam2?.aPlayers, order, key: 'sPlayingRole' })
  const { t } = useTranslation()
  return (
    <section className="common-section pb-0">
      <p className={`${fantasystyles?.itemTitle} text-primary font-bold text-uppercase big-text`}>
        <Trans i18nKey="common:ProbablePlayingXI" />
      </p>
      <p className="big-text font-bold mb-1">{probableXI?.oTeam1?.oTeam?.sTitle}</p>
      <p className="big-text mb-2">
        {teamOnePlayer?.map((player, index) => {
          if (player?._id === probableXI?.oTeam1?.iC) {
            return `${index ? ', ' : ''}${player?.sShortName}(${t('common:C')})`
          }
          return (index ? ', ' : '') + player?.sShortName
        })}
      </p>
      {probableXI?.oTeam1?.aBenchedPlayers && (
        <p className={`${styles.bench} p-2`}>
          <span className="font-semi text-uppercase">
            <Trans i18nKey="common:Bench" /> :{' '}
          </span>
          {probableXI?.oTeam1?.aBenchedPlayers?.map((bench, index) => (index ? ', ' : '') + bench?.sShortName)}
        </p>
      )}
      <p className="big-text font-bold mb-1">{probableXI?.oTeam2?.oTeam?.sTitle}</p>
      <p className="big-text mb-2">
        {teamTwoPlayer?.map((player, index) => {
          if (player?._id === probableXI?.oTeam2?.iC) {
            return `${index ? ', ' : ''}${player?.sShortName}(${t('common:C')})`
          }
          return (index ? ', ' : '') + player?.sShortName
        })}
      </p>
      {probableXI?.oTeam2?.aBenchedPlayers && (
        <p className={`${styles.bench} p-2`}>
          <span className="font-semi text-uppercase">
            <Trans i18nKey="common:Bench" /> :{' '}
          </span>
          {probableXI?.oTeam2?.aBenchedPlayers?.map((bench, index) => (index ? ', ' : '') + bench?.sShortName)}
        </p>
      )}
    </section>
  )
}

PlayingXI.propTypes = {
  fantasystyles: PropTypes.any,
  probableXI: PropTypes.object
}

export default PlayingXI
