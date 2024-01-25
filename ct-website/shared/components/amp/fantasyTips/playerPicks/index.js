import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

const TitleBlock = dynamic(() => import('@shared-components/amp/fantasyTips/titleBlock'))
const SinglePlayerPick = dynamic(() => import('../singlePlayerPick'))

const PlayerPicks = ({ fantasystyles, playersData }) => {
  const { t } = useTranslation()
  const platFormType = playersData?.ePlatformType

  return (
    <>
      <style jsx amp-custom>{`
    
    `}</style>
      <section className="playerPicks common-section pb-0" id="cVc">
        <TitleBlock title={t('common:PlayerPicks')} />
        <div>
          <h3 className="small-head mt-2 mt-sm-3">{t('common:Captains')}</h3>
          <div className="list">
            {
              playersData?.aCVCFan?.map((captainData, index) => (
                <SinglePlayerPick key={index} type="captains" data={captainData} platFormType={platFormType} />
              ))}
          </div>
          <h3 className="small-head mt-2 mt-sm-3">{t('common:Top')}</h3>
          <div className="list">
            {
              playersData?.aTopicPicksFan?.map((topPickData, index) => (
                <SinglePlayerPick key={index} type="top" data={topPickData} platFormType={platFormType} />
              ))}
          </div>
          <h3 className="small-head mt-2 mt-sm-3">{t('common:Budget')}</h3>
          <div className="list">
            {
              playersData?.aBudgetPicksFan?.map((budgetData, index) => (
                <SinglePlayerPick key={index} type="budget" data={budgetData} platFormType={platFormType} />
              ))}
          </div>
        </div>
      </section>
    </>
  )
}

PlayerPicks.propTypes = {
  fantasystyles: PropTypes.any,
  playersData: PropTypes.object
}

export default PlayerPicks
