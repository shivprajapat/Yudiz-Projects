import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

const TitleBlock = dynamic(() => import('@shared-components/amp/fantasyTips/titleBlock'))

const PlayingXI = ({ probableXI }) => {
  const { t } = useTranslation()
  return (
    <>
      <style jsx amp-custom>{`
 .bench{background:#f2f4f7;padding:8px;border-radius:8px}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      <section className="common-section pb-0">
        <TitleBlock title={<Trans i18nKey="common:ProbablePlayingXI" />} />
        <p className="big-text font-bold mb-1">{probableXI?.oTeam1?.oTeam?.sTitle}</p>
        <p className="big-text mb-2">
          {probableXI?.oTeam1?.aPlayers?.map((player, index) => {
            if (player?._id === probableXI?.oTeam1?.iC) {
              return `${index ? ', ' : ''}${player?.sShortName}(${t('common:C')})`
            }
            return (index ? ', ' : '') + player?.sShortName
          })}
        </p>
        {probableXI?.oTeam1?.aBenchedPlayers && (
          <p className="bench p-2">
            <span className="font-semi text-uppercase">
              <Trans i18nKey="common:Bench" /> :{' '}
            </span>
            {probableXI?.oTeam1?.aBenchedPlayers?.map((bench, index) => (index ? ', ' : '') + bench?.sShortName)}
          </p>
        )}
        <p className="big-text font-bold mb-1">{probableXI?.oTeam2?.oTeam?.sTitle}</p>
        <p className="big-text mb-2">
          {probableXI?.oTeam2?.aPlayers?.map((player, index) => {
            if (player?._id === probableXI?.oTeam2?.iC) {
              return `${index ? ', ' : ''}${player?.sShortName}(${t('common:C')})`
            }
            return (index ? ', ' : '') + player?.sShortName
          })}
        </p>
        {probableXI?.oTeam2?.aBenchedPlayers && (
          <p className="bench p-2">
            <span className="font-semi text-uppercase">
              <Trans i18nKey="common:Bench" /> :{' '}
            </span>
            {probableXI?.oTeam2?.aBenchedPlayers?.map((bench, index) => (index ? ', ' : '') + bench?.sShortName)}
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
