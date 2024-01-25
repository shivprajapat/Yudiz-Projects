import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

const TitleBlock = dynamic(() => import('@shared-components/amp/fantasyTips/titleBlock'))
const SinglePlayerPick = dynamic(() => import('../singlePlayerPick'))

const PlayerPicks = ({ fantasystyles, playersData, playerTeam }) => {
  const { t } = useTranslation()
  const platFormType = playersData?.ePlatformType

  return (
    <section className="common-section pb-0">
      <TitleBlock title={t('common:PlayerPicks')} />
      <div className="commonNav stickyNav d-flex isSticky themeLightNav text-nowrap text-uppercase equal-width-nav justify-content-center flex-nowrap t-center">
        <amp-selector role="tablist" on="select:playerPicks.toggle(index=event.targetOption, value=true)">
          <div role="tab" option={'0'} selected={true} className="item nav-link">{t('common:Captains')}</div>
          <div role="tab" option={'1'} className="item nav-link">{t('common:Top')}</div>
          <div role="tab" option={'2'} className="item nav-link">{t('common:Budget')}</div>
        </amp-selector>
      </div>
      <section className="playerPicks" id="cVc">
        <div className="ampSelectorContent">
          <amp-selector id="playerPicks" role="listbox">
            <div className='viewOptions' role="tabpanel" option='' selected={true}>
              {playersData?.aCVCFan?.map((captainData, index) => (
                <SinglePlayerPick key={index} playerTeam={playerTeam} type="captains" data={captainData} platFormType={platFormType} />
              ))}
            </div>
            <div className='viewOptions' role="tabpanel" option='' >
              {playersData?.aTopicPicksFan?.map((topPickData, index) => (
                <SinglePlayerPick key={index} playerTeam={playerTeam} type="top" data={topPickData} platFormType={platFormType} />
              ))}
            </div>
            <div className='viewOptions' role="tabpanel" option='' >
              {playersData?.aBudgetPicksFan?.map((budgetData, index) => (
                <SinglePlayerPick key={index} playerTeam={playerTeam} type="budget" data={budgetData} platFormType={platFormType} />
              ))}
            </div>
          </amp-selector>
        </div>
      </section>
    </section>
  )
}

PlayerPicks.propTypes = {
  fantasystyles: PropTypes.any,
  playersData: PropTypes.object,
  playerTeam: PropTypes.object
}

export default PlayerPicks
