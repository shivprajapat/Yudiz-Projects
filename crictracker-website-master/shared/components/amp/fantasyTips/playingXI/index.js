import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import { arraySortByOrder } from '@shared/utils'

const TitleBlock = dynamic(() => import('@shared-components/amp/fantasyTips/titleBlock'))

const PlayingXI = ({ probableXI }) => {
  const { t } = useTranslation()
  const order = ['bat', 'all', 'wk', 'wkbat', 'bowl']
  const teamOnePlayer = arraySortByOrder({ data: probableXI?.oTeam1?.aPlayers, order, key: 'sPlayingRole' })
  const teamTwoPlayer = arraySortByOrder({ data: probableXI?.oTeam2?.aPlayers, order, key: 'sPlayingRole' })

  function getPlayer(player, index, key) {
    if (player?.eTagStatus === 'a') {
      if (player?._id && player?._id === probableXI[key]?.iC) {
        return (
          <React.Fragment key={index}>
            {(index ? ', ' : '')}
            <a href={`/${player?.oSeo?.sSlug}/`}>{`${player?.sShortName} (${t('common:C')})`}</a>
          </React.Fragment>
        )
      } else if (player?._id && player?._id === probableXI[key]?.iVC) {
        return (
          <React.Fragment key={index}>
            {(index ? ', ' : '')}
            <a href={`/${player?.oSeo?.sSlug}/`}>{`${player?.sShortName} (${t('common:VC')})`}</a>
          </React.Fragment>
        )
      } else if (player?._id && player?._id === probableXI[key]?.iWK) {
        return (
          <React.Fragment key={index}>
            {(index ? ', ' : '')}
            <a href={`/${player?.oSeo?.sSlug}/`}>{`${player?.sShortName} (${t('common:Wk')})`}</a>
          </React.Fragment>
        )
      } else {
        return (
          <React.Fragment key={index}>
            {(index ? ', ' : '')}
            <a href={`/${player?.oSeo?.sSlug}/`}>{player?.sShortName}</a>
          </React.Fragment>
        )
      }
    } else {
      if (player?._id && player?._id === probableXI[key]?.iC) {
        return `${index ? ', ' : ''}${player?.sShortName} (${t('common:C')})`
      } else if (player?._id && player?._id === probableXI[key]?.iVC) {
        return `${index ? ', ' : ''}${player?.sShortName} (${t('common:VC')})`
      } else if (player?._id && player?._id === probableXI[key]?.iWK) {
        return `${index ? ', ' : ''}${player?.sShortName} (${t('common:Wk')})`
      } else {
        return (index ? ', ' : '') + player?.sShortName
      }
    }
  }
  return (
    <>
      <style jsx amp-custom>{`
 .bench{background:var(--theme-bg);padding:8px;border-radius:8px}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      <section className="common-section pb-0">
        <TitleBlock title={<Trans i18nKey="common:ProbablePlayingXI" />} />
        <p className="big-text font-bold mb-1">{probableXI?.oTeam1?.oTeam?.sTitle}</p>
        <p className="big-text mb-2">
          {teamOnePlayer?.map((player, index) => {
            return getPlayer(player, index, 'oTeam1')
          })}
        </p>
        {probableXI?.oTeam1?.aBenchedPlayers?.length > 0 && (
          <p className="bench p-2">
            <span className="font-semi text-uppercase">
              <Trans i18nKey="common:Bench" /> :{' '}
            </span>
            {probableXI?.oTeam1?.aBenchedPlayers?.map((bench, index) => {
              return getPlayer(bench, index)
            })}
          </p>
        )}
        <p className="big-text font-bold mb-1">{probableXI?.oTeam2?.oTeam?.sTitle}</p>
        <p className="big-text mb-2">
          {teamTwoPlayer?.map((player, index) => {
            return getPlayer(player, index, 'oTeam2')
          })}
        </p>
        {probableXI?.oTeam2?.aBenchedPlayers?.length > 0 && (
          <p className="bench p-2 mb-0">
            <span className="font-semi text-uppercase">
              <Trans i18nKey="common:Bench" /> :{' '}
            </span>
            {probableXI?.oTeam2?.aBenchedPlayers?.map((bench, index) => getPlayer(bench, index))}
          </p>
        )}
      </section>
    </>
  )
}

PlayingXI.propTypes = {
  probableXI: PropTypes.object
}

export default PlayingXI
