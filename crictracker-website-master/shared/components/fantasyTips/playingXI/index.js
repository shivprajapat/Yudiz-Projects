import React from 'react'
import PropTypes from 'prop-types'
import styles from './style.module.scss'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import { arraySortByOrder } from '@shared/utils'
import CustomLink from '@shared/components/customLink'

const PlayingXI = ({ fantasystyles, probableXI }) => {
  const order = ['bat', 'all', 'wk', 'wkbat', 'bowl']
  const teamOnePlayer = arraySortByOrder({ data: probableXI?.oTeam1?.aPlayers, order, key: 'sPlayingRole' })
  const teamTwoPlayer = arraySortByOrder({ data: probableXI?.oTeam2?.aPlayers, order, key: 'sPlayingRole' })
  const { t } = useTranslation()

  function getPlayer(player, index, key) {
    if (player?.eTagStatus === 'a') {
      if (player?._id && player?._id === probableXI[key]?.iC) {
        return (
          <React.Fragment key={`playingXI${index}`}>
            {(index ? ', ' : '')}
            <CustomLink href={`/${player?.oSeo?.sSlug}/`}>
              <a>{`${player?.sShortName} (${t('common:C')})`}</a>
            </CustomLink>
          </React.Fragment>
        )
      } else if (player?._id && player?._id === probableXI[key]?.iVC) {
        return (
          <React.Fragment key={`playingXI${index}`}>
            {(index ? ', ' : '')}
            <CustomLink href={`/${player?.oSeo?.sSlug}/`}>
              <a>{`${player?.sShortName} (${t('common:VC')})`}</a>
            </CustomLink>
          </React.Fragment>
        )
      } else if (player?._id && player?._id === probableXI[key]?.iWK) {
        return (
          <React.Fragment key={`playingXI${index}`}>
            {(index ? ', ' : '')}
            <CustomLink href={`/${player?.oSeo?.sSlug}/`}>
              <a>{`${player?.sShortName} (${t('common:Wk')})`}</a>
            </CustomLink>
          </React.Fragment>
        )
      } else {
        return (
          <React.Fragment key={`playingXI${index}`}>
            {(index ? ', ' : '')}
            <CustomLink href={`/${player?.oSeo?.sSlug}/`}>
              <a>{player?.sShortName}</a>
            </CustomLink>
          </React.Fragment>
        )
      }
    } else {
      if (player?._id && player?._id === probableXI[key]?.iC) {
        return <React.Fragment key={`p${index}`} >{`${index ? ', ' : ''}${player?.sShortName} (${t('common:C')})`}</React.Fragment>
      } else if (player?._id && player?._id === probableXI[key]?.iVC) {
        return <React.Fragment key={`p${index}`} >{`${index ? ', ' : ''}${player?.sShortName} (${t('common:VC')})`}</React.Fragment>
      } else if (player?._id && player?._id === probableXI[key]?.iWK) {
        return <React.Fragment key={`p${index}`} >{`${index ? ', ' : ''}${player?.sShortName} (${t('common:Wk')})`}</React.Fragment>
      } else {
        return <React.Fragment key={`p${index}`} >{(index ? ', ' : '') + player?.sShortName}</React.Fragment>
      }
    }
  }

  return (
    <section className="common-section pb-0" id="playingXI">
      <p className={`${fantasystyles?.itemTitle} text-primary fw-bold text-uppercase`}>
        <Trans i18nKey="common:ProbablePlayingXI" />
      </p>
      <p className="big-text fw-bold mb-1">{probableXI?.oTeam1?.oTeam?.sTitle}</p>
      <p className="big-text mb-2">
        {teamOnePlayer?.map((player, index) => {
          return getPlayer(player, index, 'oTeam1')
        })}
      </p>
      {probableXI?.oTeam1?.aBenchedPlayers?.length > 0 && (
        <p className={`${styles.bench} p-2 br-sm`}>
          <span className="font-semi text-uppercase">
            <Trans i18nKey="common:Bench" /> :{' '}
          </span>
          {probableXI?.oTeam1?.aBenchedPlayers?.map((bench, index) => {
            return getPlayer(bench, index)
          })}
        </p>
      )}
      <p className="big-text fw-bold mb-1">{probableXI?.oTeam2?.oTeam?.sTitle}</p>
      <p className="big-text mb-2">
        {teamTwoPlayer?.map((player, index) => {
          return getPlayer(player, index, 'oTeam2')
        })}
      </p>
      {probableXI?.oTeam2?.aBenchedPlayers?.length > 0 && (
        <p className={`${styles.bench} p-2 br-sm`}>
          <span className="font-semi text-uppercase">
            <Trans i18nKey="common:Bench" /> :{' '}
          </span>
          {probableXI?.oTeam2?.aBenchedPlayers?.map((bench, index) => {
            return getPlayer(bench, index)
          })}
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
